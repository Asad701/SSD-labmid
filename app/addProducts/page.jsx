'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Loading from '@/app/components/Loading';

export default function AdminDashboard() {
  // Miscellaneous
  const [search, setSearch] = useState('');
  const [selectionType, setSelectionType] = useState('main');
  const [message, setMessage] = useState('');

  //data storing
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [comments, setComments] = useState([]);
  const[users , setUsers] = useState([]);
  const [searchId , setSearchId] =useState('');
  const [selectedUser , setSelectedUser] = useState(null);


  // Product fields
  const [pid, setPid] = useState('');
  const [ptitle, setPtitle] = useState('');
  const [pslug, setPslug] = useState('');  
  const [pdimension, setPdimension] = useState('');
  const [pdescription, setPdescription] = useState('');
  const [pprice, setPprice] = useState('');
  const [pdiscount, setPdiscount] = useState('');
  const [pcategory, setPcategory] = useState([]);
  const [ptags, setPtags] = useState('');
  const [pmainimage, setMainimage] = useState(null);
  const [pgallery, setPgallery] = useState(null);
  const [OK ,setOK] = useState(false);

  // Password fields
  const [pwd, setPwd] = useState('');
  const [confirmpwd, setConfirmPwd] = useState('');
  const[ prevpwd , setPrevPwd] = useState('');
  
  // cat fields
  const [catTitle , setCatTitle] = useState('');
  const [ catImage , setCatImage] = useState(null);



  // disable buttons
  const [ disable , setDisable] = useState({});
  const [ pdisable , setPDisable] = useState({});

  const router = useRouter();

  // all orders
  const [orders, setOrders] = useState([]);
  const [shipped, setShipped] = useState([]);
  const [nShipped, setNShipped] = useState([]);
  const [select, setSelect] = useState('');


  //Misc
  const [MComments, setMComments] = useState([]);
  const [Mdisable , setMDisable] = useState({});
  const [MformData, setMFormData] = useState({
    miscid: 'dummy001',
    videos: [],
    images: [],
    comments: [],
    promo: {
      percentage: '',
      image: null, 
    },
  });

  const [Misc , setMisc] = useState({});


  // verification 
    useEffect(() => {
      const Verify = async () => {
        try {
          const res = await fetch('/api/admin');
          const data = await res.json();
          if (!res.ok) {
            setMessage(data.message);
            setOK(false);
            return;
          }
            setOK(true);
            setMessage(data.message);
        } catch (error) {
            setMessage('Invalid response from server');
            setOK(false);
        }

      };
      Verify();
    }, []);

  // Fetch categories
    useEffect(() => {
      const fetchCategory = async () => {
        try {
          const res = await fetch('/api/category');
          const data = await res.json();
          setCategory(Array.isArray(data) ? data : []);
        } catch {
          setMessage('Error fetching categories');
        }
      };
      fetchCategory();
    }, []);

  // get all orders
    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const res = await fetch('/api/allorders');
          const data = await res.json();
          if (res.ok) {
            setOrders(data);
          } else {
            setMessage(data.message || 'Failed to load orders');
          }
        } catch {
          setMessage('An error occurred while fetching user data.');
        }
      };
      fetchOrders();
    }, []);

  // verification 
    useEffect(() => {
      const Verify = async () => {
        try {
          const res = await fetch('/api/admin');
          const data = await res.json();
          if (!res.ok) {
            setMessage(data.message);
            return;
          }
          setMessage(data.message);
        } catch (error) {
            setMessage('Invalid response from server');
        }

      };
      Verify();
    }, []);


  // Fetch all comments
    useEffect(() => {
      const fetchComments = async () => {
        try {
          const res = await fetch('/api/comments');
          if (!res.ok) return setMessage('Unauthorized');
          const data = await res.json();
          setMComments(Array.isArray(data) ? data : []);
        } catch {
          setMessage('Error fetching comments');
        }
      };
      fetchComments();
    }, []);

  // Handle text and number input changes
    const handleMChange = (e) => {
      const { name, value } = e.target;
      if (name === 'promo.percentage') {
        setMFormData((prev) => ({
          ...prev,
          promo: { ...prev.promo, percentage: value },
        }));
      } else {
        setMFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    };

  // Handle file inputs
    const handleMFileChange = (e) => {
      const { name, files } = e.target;
      if (name === 'promo.image') {
        setMFormData((prev) => ({
          ...prev,
          promo: { ...prev.promo, image: files[0] },
        }));
      } else {
        setMFormData((prev) => ({
          ...prev,
          [name]: Array.from(files),
        }));
      }
    };

  // HANDLE ADD COMMENT
    const handleMClick = (c) => {
      setMDisable(prev => ({ ...prev, [c._id]: true }))
      addMComment(c.userName, c.comment);
    };

 // Add comment to formData.comments
    const addMComment = (userName, comment) => {
    setMFormData((prev) => ({
      ...prev,
      comments: [...prev.comments, { userName, comment }],
    }));
    };

  // Submit updated form
    const handleMSubmit = async (e) => {
      e.preventDefault();

      const body = new FormData();
      body.append('miscid', MformData.miscid);
      MformData.videos.forEach((file) => body.append('videos', file));
      MformData.images.forEach((file) => body.append('images', file));
      body.append('comments', JSON.stringify(MformData.comments));

      // Handle promo
      if (MformData.promo.percentage) {
        body.append('promoPercentage', MformData.promo.percentage);
      }
      if (MformData.promo.image) {
        body.append('promoImage', MformData.promo.image);
      }

      const res = await fetch('/api/misc', {
        method: 'PATCH',
        body,
      });

      const result = await res.json();
      setMessage(result.message || 'Changes saved');
      setMFormData({
        miscid: 'dummy001',
        videos: [],
        images: [],
        comments: [],
        promo: {
          percentage: '',
          image: null, 
        },
      });
    };

  // handle shipping
    const handleShip = async (orderid, dhltracking) => {
      try {
        const res = await fetch('/api/allorders', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderid, dhltracking }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setMessage(data.message);

        setOrders((prev) =>
          prev.map((o) =>
            o.orderid === orderid ? { ...o, shipped: true, dhltracking, modifiedAt: new Date().toISOString() } : o
          )
        );
      } catch (err) {
        setMessage(err.message || 'An error occurred while updating order');
      }
    };

  //set shiioped and not shipped
    useEffect(() => {
      const s = [], ns = [];
      orders.forEach((o) => (o.shipped ? s.push(o) : ns.push(o)));
      setShipped(s);
      setNShipped(ns);
    }, [orders]);

  // handle shipped
    const handleShipped = (type) => setSelect(type);
    if (!orders.length && !message) {
      return <div className="w-full h-auto flex justify-center items-center p-8 bg-black"><Loading /></div>;
    }


  // Fetch all users
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch {
        setMessage('internal server error');
      }
    };

  // Fetch All Products
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        res.ok ? setProducts(data.products) : setMessage(data.message || 'Failed to load products');
      } catch {
        setMessage('Error loading products');
      }
    };

  //getMisc.js
    const getMisc = async () => {
      try {
        const res = await fetch('/api/misc', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store', // optional, to prevent caching
        });

        const data = await res.json();

        if (!res.ok) {
          setMessage(data.message)
          return
        }
        setMisc(data[0]);
      } catch (err) {
        setMessage("internal server error");
      }
    };

  // Fetch All Comments
    const fetchComments = async () => {
        try {
          const res = await fetch('/api/comments');
          if (!res.ok) setMessage('unauthorized');
          const data = await res.json();
          setComments(Array.isArray(data) ? data : []);
        } catch {
          setMessage('Error fetching comments');
        }
    }
    
  // Add new Products
    const AddProduct = async () => {
      const formdata = new FormData();
      formdata.append('title', ptitle);
      formdata.append('slug', pslug);
      formdata.append('dimension', pdimension);
      formdata.append('description', pdescription);
      formdata.append('price', pprice);
      formdata.append('discount', pdiscount);
      formdata.append('category', JSON.stringify(pcategory));
      formdata.append('tags', ptags);
      if (pmainimage) formdata.append('mainimage', pmainimage);
      if (pgallery) Array.from(pgallery).forEach(file => formdata.append('gallery', file));

      try {
        const res = await fetch(`/api/products`, {
          method: 'POST',
          body: formdata,
        });

        const data = await res.json();
        setMessage(data.message || 'Product added!');
      } catch (error) {
        setMessage('Failed to add product');
      }
    };



  // Edit products
    const EditProduct = async () => {
      const formdata = new FormData();
      formdata.append('productid', pid);
      if (ptitle) formdata.append('title', ptitle);
      if (pdescription) formdata.append('description', pdescription);
      if (pprice) formdata.append('price', pprice);
      if (pdiscount) formdata.append('discount', pdiscount);
      if (pmainimage) formdata.append('mainimage', pmainimage);
      if (pgallery) Array.from(pgallery).forEach(file => formdata.append('gallery', file));

      try {
        const res = await fetch(`/api/products`, {
          method: 'PATCH',
          body: formdata,
        });
        const data = await res.json();
        setMessage(data.message || 'Product updated!');
      } catch {
        setMessage('Failed to update product');
      }
    };

  // handle change password
    const handleChangePwd = async (e) => {
      e.preventDefault();

      if (pwd !== confirmpwd) {
        setMessage('Passwords do not match');
        setConfirmPwd('');
        return;
      }

      try {
        const res = await fetch('/api/admin', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prevpassword: prevpwd,
            newpassword: pwd,
          }),
        });

        const data = await res.json();

        setMessage(data.message);

        if (res.ok) {
          setPwd('');
          setPrevPwd('');
          setConfirmPwd('');
        }

      } catch (err) {
        setMessage('Internal server error');
      }
    };


  //handle logout
    const handleLogout = () => {
      document.cookie = 'token=; max-age=0; path=/';
      document.cookie = 'logged_in=; max-age=0; path=/';
      router.push('/adminlogin');
    };

  // reset form
    const resetForm = () => {
      setPid('');
      setPtitle('');
      setPdescription('');
      setPprice('');
      setPdiscount('');
      setMainimage(null);
      setPgallery([]);
      setPslug('');
      setPdimension(''); 
      setPtags('');
      setConfirmPwd('');
      setPwd('');
      setPrevPwd('');
      setUsers([]);
      setSearchId('');
      setSelectedUser(null);
    };

  // handle search prooducts
    const handleSearch=()=>{
        const fetchData = async () => {
          if (!search){
            fetchProducts();
            return;
          } 
            
          try {
            const res = await fetch(`/api/products?search=${search}`, {
              cache: 'no-store',
            });
            if (!res.ok) {
              setProducts([]);
              return;
            }
            const item = await res.json();
            if (item.length === 0) {
              setProducts([]);
              return;
              
            } else {
              setProducts(item);
            }
          } catch (err) {
            console.log(err);
          } 

        };
    
        fetchData();

    }


  // handle searchUser
    const handleSearchU = () => {
      const fetchData = async () => {
        try {
          const res = await fetch(`/api/users`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ searchId:searchId }),
            cache: "no-store",
          });

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            setMessage(errorData.message || "Something went wrong");
            return;
          }

          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setSelectedUser(data[0]);
          } else {
            setMessage("No user found");
          }
        } catch (err) {
          setMessage("Internal server error");
        }
      };

      fetchData();
    };

  // delete user
    const removeUser =async(uid)=>{
      try{
        const res = await fetch("api/users",{
          method:"DELETE",
          body:JSON.stringify({uid}),
        });
        const response = await res.json();
        if(!res.ok){
          setMessage(response.message);
        }
        else{
          setMessage(response.message);
        }
      }catch(err){
        setMessage("internal server error");
      }
    }

  // delete comments from top reviews
    const deleteTopComment = async (miscid, comment, userName) => {
      try {
        const res = await fetch('/api/misc', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ miscid, comment, userName }),
        });

        const data = await res.json();

        if (!res.ok) {
          setMessage(data.message || 'Failed to delete comment');
          return false;
        }

        setMessage(data.message || 'Comment deleted successfully');
        getMisc();
        return true;
      } catch (err) {
        console.error('Delete comment error:', err);
        setMessage('Internal server error');
        return false;
      }
    };



  // remove comment
    const removeComment=async(cid)=>{
      try{
        const res = await fetch("api/comments",{
          method:"DELETE",
          body:JSON.stringify({cid}),
        });
        const response = await res.json();
        if(!res.ok){
          setMessage(response.message);
        }
        else{
          setMessage(response.message);
        }
      }catch(err){
        console.log(err);
      }
    }

  // remove product
    const removeProduct=async(pid)=>{
      try{
        const res = await fetch("api/products",{
          method:"DELETE",
          body:JSON.stringify({pid}),
        });
        const response = await res.json();
        if(!res.ok){
          setMessage(response.message);
        }
        else{
          setMessage(response.message);
        }
      }catch(err){
        console.log(err);
      }
    }

  // handleMiscEditor
    const handleMiscEditor =()=>{
      window.location.href = "/adminMiscEditor"
    };
// add category
    const handleCategoryAdd = async (e) => {
        e.preventDefault();
        const formdata = new FormData();
        if (catTitle) formdata.append('categorytitle', catTitle);
        if (catImage) formdata.append('image', catImage);

        try {
          const res = await fetch('/api/category', {
            method: 'POST',
            body: formdata,
          });

          const data = await res.json();
          setMessage(data.message || 'Category submitted.');
        } catch (err) {
          setMessage('Failed to add category');
        }

        setCatTitle('');
        setCatImage(null);
      };
    
    // diseble Cat
    const handleClick = (cid) => {
      setDisable(prev=>({...prev , [cid]:true}));
      handleDeleteCategory(cid)
    };
      
    // disable PRODUCT
    const handlePClick = (pid) => {
      setPDisable(prev=>({...prev , [pid]:true}));
      removeProduct(pid)
    };
    
  // delete categories
    const handleDeleteCategory = async (categoryid) => {
      try {
        const res = await fetch(`/api/category?categoryid=${categoryid}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        setMessage(data.message);
        fetchCategories();
        return;
      } catch (err) {
        alert('Failed to delete category');
      }
    };


  

  return (
  <div className="w-full bg-gradient-to-r from-teal-500 to-blue-700 h-full min-h-full">
  {OK ?
    <div className="flex flex-col md:flex-row lg:flex-row gap-4 p-4 w-full  min-h-full "> 
{/* Sidebar */}

      <div className="bg-blue-950 text-white rounded-lg space-y-2 md:w-1/4 md:p-5 lg:p-5 p-5 lg:w-1/4">
        <button onClick={() => { setSelectionType('allProducts'); fetchProducts(); }} className="w-full py-2 bg-blue-800 rounded">All Products</button>
        <button onClick={() => { setSelectionType('users'); fetchUsers(); resetForm();}} className="w-full py-2 bg-blue-800 rounded">All Users</button>
        <button onClick={() => {setSelectionType('allorders'); resetForm();}} className="w-full py-2 bg-blue-800 rounded">All Orders</button>
        <button onClick={() => {setSelectionType('listcategory'); resetForm();}} className="w-full py-2 bg-blue-800 rounded">All categories</button>
        <button onClick={() => { setSelectionType('Comments'); {fetchComments();} resetForm();}} className="w-full py-2 bg-blue-800 rounded">All Comments</button>
        <button onClick={() => { setSelectionType('topComments'); {getMisc();} resetForm();}} className="w-full py-2 bg-blue-800 rounded">Top reviews</button>

        <button onClick={() => {setSelectionType('addProduct'); resetForm();}} className="w-full py-2 bg-blue-800 rounded">Add Product</button>
        <button onClick={() => {setSelectionType('editProduct'); resetForm();}} className="w-full py-2 bg-blue-800 rounded">Edit Product</button>
        <button onClick={() => { setSelectionType('Dusers');  resetForm();}} className="w-full py-2 bg-blue-800 rounded">Delete A User</button>
        <button onClick={() => { setSelectionType('category');  resetForm();}} className="w-full py-2 bg-blue-800 rounded">Add catrgories</button>


        <button onClick={() => {setSelectionType('misc'); resetForm();}}  className="w-full py-2 bg-blue-800 rounded">Edit Misc</button>
        <button onClick={() => { setSelectionType('changePassword'); resetForm();}} className="w-full py-2 bg-blue-800 rounded">Change Password</button>
        <button onClick={handleLogout} className="w-full py-2 bg-red-700 rounded">Logout</button>
      </div>

{/* main layout */}

      <div className="flex-1 space-y-4 overflow-auto w-full">
  {/* All Products */}

        {selectionType === 'allProducts' && (
          <div className="space-y-2">
            {message && <div className="text-auto text-center w-full  text-white px-auto ">{message}</div>}
            <h2 className="text-xl font-bold text-white flex justify-center items-center"><span className='text-2xl'>{products.length}</span> - Products</h2>
            <div className="w-full">
              <input 
                type="text" 
                placeholder="Enter product title" 
                className="w-4/5 bg-white text-black placeholder:text-gray-400 py-2 px-4 border border-gray-300 rounded-lg "
                onChange={(e)=>{setSearch(e.target.value)}}
              />
              <button className="w-1/5 bg-black text-white py-2 rounded-full hover:bg-red-500" onClick={handleSearch}> Search</button>
            </div>
            <div className="w-full flex flex-col min-h-screen h-screen overflow-auto gap-3 p-4 scrollbar-hide">
              {products.map(p => (
                <div key={p.productid} className="relative flex flex-col lg:flex-row md:flex-row justify-start bg-gray-200 p-4 rounded-lg gap-4 items-center w-full">
                  <Image src={`/${p.mainimage}`} alt="main" width={100} height={100} className="object-contain rounded" />
                  <div className='border-blue-500 border-2 rounded-md p-2 '>
                    <p><strong>ID:</strong> {p.productid}</p>
                    <p><strong>Title:</strong> {p.title}</p>
                  </div>
                  <div className='border-blue-500 border-2 rounded-md p-2'>
                    <p><strong>Price:</strong> {p.price}</p>
                    <p><strong>Discount:</strong> {p.discount}</p>
                  </div>
                  <div className='border-blue-500 border-2 rounded-md p-2 '>
                    <p><strong>Sellings:</strong> {p.sellingcount}</p>
                    <p className='overflow-auto'><strong>Categories:</strong> {p.category.join('    ,   ')}</p>
                  </div>
                  <Image src="/deleteW .svg" alt="delete button" width={30} height={30} disabled={pdisable[p.productid]} className={`absolute top-1 right-1 p-2 text-lg w-[28px] h-[28px] flex justify-center items-center rounded-full transition-colors
                      ${pdisable[p.productid] ? 'bg-red-600 text-white cursor-not-allowed' : 'bg-black  hover:bg-black/70 hover:text-white'}`} onClick={()=>{handlePClick(p.productid)}} />  
                </div>
              ))}
            </div>
          </div>
        )}

  {/* All Top comments */}
        {selectionType === 'topComments' && (
          <div>
            <h2 className="w-full text-xl font-bold text-white">All Comments</h2>
            {message && (
              <div className="text-auto text-center w-full text-white">{message}</div>
            )}
            <div className="w-full h-screen overflow-auto scrollbar-hide flex flex-col justify-start items-start">
              {Misc?.comments?.length > 0 ? (
                Misc.comments.map((c, i) => (
                  <div
                    key={i}
                    className="relative bg-white text-black p-3 my-2 rounded w-full"
                  >
                    <p className="text-lg">{c.comment}</p>
                    <p className="text-sm text-gray-700 italic">- {c.userName}</p>
                    <div
                      className="absolute top-0 right-0 cursor-pointer text-white bg-black rounded-full w-[20px] h-[20px] flex justify-center items-center hover:bg-red-500"
                      onClick={() => deleteTopComment(Misc.miscid, c.comment, c.userName)}
                    >
                      X
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-300">No comments available</p>
              )}
            </div>
          </div>
        )}


  {/* List cat */}

        {selectionType === 'listcategory' && (
          <div className="space-y-2">
            {message && <div className="text-auto text-center w-full  text-white px-auto ">{message}</div>}
            <h2 className="text-xl font-bold text-white flex justify-center items-center">List Of Categories</h2>
            <div className="w-full flex flex-col min-h-screen h-screen overflow-auto gap-3 p-4 scrollbar-hide">
              {category.map(c => (
                <div key={c.categoryid} className="relative flex justify-start bg-gray-200 p-4 rounded-lg gap-4 items-center ">
                  <Image src={`/${c.image}`} alt="main" width={100} height={100} className="object-contain rounded" />
                  <div className='border-blue-500 border-2 rounded-md p-2 '>
                    <p><strong>Title:</strong> {c.title}</p>
                  </div>
                  <div className='border-blue-500 border-2 rounded-md p-2 '>
                    <p><strong>ID:</strong> {c.categoryid}</p>
                  </div>
                  <Image src="/deleteW .svg" alt="delete button" width={30} height={30} disabled={disable[c.categoryid]}  onClick={()=>{handleClick(c.categoryid)}}
                    className={`absolute top-1 right-1 text-lg w-[28px] h-[28px] p-2 flex justify-center items-center rounded-full transition-colors
                      ${disable[c.categoryid] ? 'bg-red-600 text-white cursor-not-allowed' : 'bg-black  hover:bg-black/70 hover:text-white'}`} />  
                </div>
              ))}
            </div>
          </div>
        )}

  {/*  misc */}
        {selectionType === 'misc' && (
          <div className="max-w-4xl mx-auto p-6 text-white bg-gradient-to-r from-teal-500 to-blue-700">
            {message && <div className="text-auto text-center w-full  text-white px-auto ">{message}</div>}
            <h1 className="text-3xl font-bold mb-6">Admin Misc Editor</h1>
            <form onSubmit={handleMSubmit} className="space-y-8">
              {/* Video Upload */}
              <div>
                <label className="block font-semibold mb-2">Upload Videos for ART Work</label>
                <input
                  type="file"
                  name="videos"
                  multiple
                  accept="video/*"
                  onChange={handleMFileChange}
                  className="w-full file:bg-green-600 file:text-white file:rounded file:px-4 file:py-1 file:mr-4 bg-gray-200 p-2 text-black rounded"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block font-semibold mb-2">Upload Images for Slider</label>
                <input
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
                  onChange={handleMFileChange}
                  className="w-full file:bg-green-600 file:text-white file:rounded file:px-4 file:py-1 file:mr-4 bg-gray-200 text-black p-2 rounded"
                />
              </div>

              {/* Promo Section */}
              <div className="border-t pt-4">
                <h2 className="text-2xl font-semibold mb-2">Promo Section</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Promo Percentage</label>
                    <input
                      type="number"
                      name="promo.percentage"
                      value={MformData.promo.percentage}
                      onChange={handleMChange}
                      className="w-full bg-gray-200 p-2 rounded text-black"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Promo Image Upload</label>
                    <input
                      type="file"
                      name="promo.image"
                      accept="image/*"
                      onChange={handleMFileChange}
                      className="w-full file:bg-green-600 file:text-white file:rounded file:px-4 file:py-1 file:mr-4 bg-gray-200 p-2 text-black rounded"
                    />
                  </div>
                </div>
                {message && <div className="text-auto text-center w-full  text-white px-auto ">{message}</div>}
              </div>

              {/* Comments Section */}
              <div className="border-t pt-4">
                <h2 className="text-2xl font-semibold mb-2">Add Comments to Top Comments</h2>
                {message && <div className="text-auto text-center w-full  text-white px-auto ">{message}</div>}
                <div className="flex flex-col w-full h-[300px] overflow-y-auto gap-3 p-2 border rounded bg-gray-200 scrollbar-hide">
                  {MComments.map((c, i) => (
                    <div key={i} className="relative flex flex-col w-full gap-1 bg-blue-800 px-5 py-3 rounded-xl">
                      <div className="text-white text-base">{c.comment}</div>
                      <div className="text-white italic text-sm">- {c.userName}</div>
                        <button
                          type="button"
                          disabled={disable[[c._id]]}
                          onClick={()=>{handleMClick(c)}}
                          className={`absolute top-1 right-1 text-lg w-[28px] h-[28px] flex justify-center items-center rounded-full transition-colors
                            ${Mdisable[c._id] ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-white text-black hover:bg-blue-600 hover:text-white'}`}
                        >
                          ✔
                        </button>
                    </div>
                  ))}
                </div>
                
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow"
                >
                  Save All Changes
                </button>
              </div>
            </form>
            {message && <div className="text-auto text-center w-full  text-white px-auto ">{message}</div>}
          </div>
      )}

  {/* all orders */}
        {selectionType === 'allorders' && (
        <div className=' bg-white w-full flex flex-col gap-4 items-center justify-start max-w-4xl mx-auto p-6 wifull bg-gradient-to-r from-teal-500 to-blue-700'>
          {message && <div className="text-auto text-center w-full  text-white px-auto ">{message}</div>}
          <h1 className='w-full p-5 text-2xl bg-blue-700 text-white text-center rounded-full shadow'>
            Select Option
          </h1>
          <div className="w-full md:w-[60%] p-6 bg-blue-100 rounded-xl flex justify-evenly items-center shadow">
            <button
              className={`bg-blue-500 hover:bg-blue-600 transition text-white rounded-lg text-md px-6 py-3 ${select === 'shipped' ? 'ring-2 ring-white' : ''}`}
              onClick={() => handleShipped('shipped')}
            >
              Shipped Orders
            </button>
            <button
              className={`bg-blue-500 hover:bg-blue-600 transition text-white rounded-lg text-md px-6 py-3 ${select === 'notshipped' ? 'ring-2 ring-white' : ''}`}
              onClick={() => handleShipped('notshipped')}
            >
              Not Shipped Yet
            </button>
          </div>

          <div className='flex flex-col gap-4 w-[95%] md:w-[85%] max-h-[600px] overflow-auto bg-blue-50 rounded-xl p-4 shadow-md'>
            {select === 'shipped' && shipped.length === 0 && (
              <div className="text-center text-blue-700 font-semibold text-lg p-6 bg-white rounded-xl shadow">
                🚚 You have no (shipped orders) yet!
              </div>
            )}
            {select === 'notshipped' && nShipped.length === 0 && (
              <div className="text-center text-blue-700 font-semibold text-lg p-6 bg-white rounded-xl shadow">
                📦 No pending shipments at the moment!
              </div>
            )}

            {select === 'shipped' &&
              shipped.map((or, index) => (
                <OrderCard key={index} order={or} />
              ))}
            {select === 'notshipped' &&
              nShipped.map((or, index) => (
                <OrderCard key={index} order={or} onAddTracking={handleShip} />
              ))}
          </div>
          {message && <div className="text-auto text-center w-full  text-white px-auto ">{message}</div>}
        </div>
      )}

  {/* All users */}
      {selectionType === 'users' && (
        <div className="space-y-2">
          {message && <div className="text-auto text-center w-full  text-white px-auto ">{message}</div>}
          <h2 className="text-xl font-bold text-white flex justify-center items-center">
            All Users
          </h2>
          <div className="w-full flex flex-col min-h-screen h-screen overflow-auto gap-3 p-4 scrollbar-hide">
            {users.map((u) => (
              <div
                key={u.userid}
                className="relative flex flex-col lg:flex-row md:flex-row justify-start bg-gray-200 p-6 rounded-lg gap-20 items-center"
              >
                <Image
                  src={`/${u.avatar}`}
                  alt="main image avatar"
                  width={100}
                  height={100}
                  className="object-contain rounded"
                />
              <div>
                <p><strong>Name:</strong> {u.fname} {u.lname}</p>
                <p><strong>User ID:</strong> {u.userid}</p>
                <p><strong>Email:</strong> {u.email}</p>
                <p><strong>Country:</strong> {u.country}</p>
              </div>
              </div>
            ))}
          </div>
        </div>
      )}

  {/* Delete Users */}
      {selectionType === 'Dusers' && (
        <div className="space-y-4 p-4">
          {message && <div className="text-auto text-center w-full  text-white px-auto ">{message}</div>}
          <h2 className="text-xl font-bold text-white flex justify-center items-center">
            Delete User
          </h2>

          {/* Input Bar */}
          <div className="flex flex-col items-center justify-center gap-2">
            <input
              type="text"
              placeholder="Enter User ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="p-2 rounded border border-gray-400 w-full bg-white flex-1"
            />
            <button
              onClick={handleSearchU}
              className="bg-blue-500 text-white w-[50%] px-4 py-2 rounded hover:bg-blue-600"
            >
              OK
            </button>
          </div>

          {selectedUser ? (
            <div className="bg-gray-200 p-4 rounded-lg flex flex-col lg:flex-row md:flex-row gap-4 items-center">
              <Image
                src={`/${selectedUser.avatar}`}
                alt="User Avatar"
                width={100}
                height={100}
                className="object-contain rounded"
              />
              <div>
                <p><strong>Name:</strong> {selectedUser.fname} {selectedUser.lname}</p>
                <p><strong>User ID:</strong> {selectedUser.userid}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Country:</strong> {selectedUser.country}</p>
              </div>
              <button
                onClick={() => removeUser(selectedUser.userid)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ) : <div className="text-auto text-center w-full  text-white px-auto ">{message}</div>
          }
        </div>
      )}

  {/* ADD CATEGORY */}
        {selectionType === 'category' && (
          <>{message && <div className="text-auto text-center w-full  text-white px-auto ">{message}</div>}
          <form onSubmit={(e) => handleCategoryAdd(e)} className='max-w-md mx-auto p-6 bg-white shadow-md rounded-xl space-y-5'>
             <h2 className="text-2xl font-bold text-gray-800 text-center">ADD Category</h2>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">category image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCatImage(e.target.files[0])}
                className="w-full file:bg-green-600 file:text-white file:rounded file:px-4 file:py-1 file:mr-4 bg-gray-200 p-2 rounded"
                required
              />
            </div>
            <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Title:</label>
              <input
                type="text"
                placeholder="Enter category name in CAPITAL words"
                value={catTitle}
                onChange={(e) => setCatTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 transition duration-200 text-white font-semibold py-2 px-4 rounded-lg">Submit</button>
          </form>
          {message && <div className="text-auto text-center w-full  text-white px-auto ">{message}</div>}
        </>  
        )}
        
  {/* Add Products */}
        {selectionType === 'addProduct' && (
          <>
          {message && <div className="text-auto text-center w-full  text-white px-auto ">{message}</div>}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              AddProduct();
            }}
            className="space-y-6 bg-white p-6 rounded-2xl shadow-lg max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-gray-800 ">Add New Product</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {[
                { label: "Title", value: ptitle, setter: setPtitle, placeholder: "Enter product title" },
                { label: "Slug", value: pslug, setter: setPslug, placeholder: "URL-friendly slug" },
                { label: "Dimension", value: pdimension, setter: setPdimension, placeholder: "e.g. length x width x height" },
                { label: "Tags (comma separated)", value: ptags, setter: setPtags, placeholder: "e.g. wood, steel" },
              ].map(({ label, value, setter, placeholder }, i) => (
                <div key={i}>
                  <label className="block text-sm font-semibold text-gray-700">{label}</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className="w-full bg-gray-200 p-2 rounded border focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder={placeholder}
                    required
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-gray-700">Price ($)</label>
                <input
                  type="number"
                  value={pprice}
                  onChange={(e) => setPprice(e.target.value)}
                  required
                  className="w-full bg-gray-200 p-2 rounded border focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Discount ($)</label>
                <input
                  type="number"
                  value={pdiscount}
                  required
                  onChange={(e) => setPdiscount(e.target.value)}
                  className="w-full bg-gray-200 p-2 rounded border focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Description</label>
              <textarea
                value={pdescription}
                required
                onChange={(e) => setPdescription(e.target.value)}
                className="w-full bg-gray-200 p-2 rounded border h-24 focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Write a long description"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700">Main Image</label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => setMainimage(e.target.files[0])}
                className="w-full file:bg-green-600 file:text-white file:rounded file:px-4 file:py-1 file:mr-4 bg-gray-200 p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Gallery Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                required
                onChange={(e) => setPgallery(e.target.files)}
                className="w-full file:bg-green-600 file:text-white file:rounded file:px-4 file:py-1 file:mr-4 bg-gray-200 p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Select Categories</label>
              <div className="border rounded-lg p-3 bg-gray-100 max-h-40 overflow-y-auto">
                {category.map((cat, i) => (
                  <label key={i} className="flex items-center space-x-2 mb-1">
                    <input
                      type="checkbox"
                      value={cat.title}
                      checked={pcategory.includes(cat.title)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setPcategory(([...pcategory, cat.title]));
                        }
                        else{
                          setPcategory(pcategory.filter((c) => c !== cat.title))
                        }
                      }}
                      className="accent-green-600"
                    />
                    <span className="text-gray-700">{cat.title}</span>
                  </label>
                ))}
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Selected:</strong> {pcategory.join(",")}
                </p>
              </div>
            </div>
            <button
              type="submit"
              className="bg-green-700 hover:bg-green-800 text-white font-medium py-2 px-6 rounded-lg transition-all w-full mt-4"
            >
              Add Product
            </button>
          </form>
          {message && <div className="text-auto text-center w-full  text-white px-auto ">{message}</div>}
          </>
        )}

  {/* Edit Products */}
        {selectionType === 'editProduct' && (
          <>
          {message && <div className="text-auto text-center w-full  text-white px-auto ">{message}</div>}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              EditProduct();
            }}
            className="space-y-4 p-4 bg-white shadow-md rounded-lg max-w-xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>

            <div>
              <label className="block text-sm font-medium text-gray-600">Product ID</label>
              <input
                type="text"
                placeholder="Enter Product ID"
                value={pid}
                onChange={(e) => setPid(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-yellow-600 bg-gray-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">New Title</label>
              <input
                type="text"
                placeholder="New Title"
                value={ptitle}
                onChange={(e) => setPtitle(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded p-2 bg-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">New Description</label>
              <textarea
                type="text"
                placeholder="New Description"
                value={pdescription}
                onChange={(e) => setPdescription(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded p-2 bg-gray-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">New Price</label>
                <input
                  type="number"
                  placeholder="New Price"
                  value={pprice}
                  onChange={(e) => setPprice(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2 bg-gray-300"
                
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">New Discount (%)</label>
                <input
                  type="number"
                  placeholder="Discount"
                  value={pdiscount}
                  onChange={(e) => setPdiscount(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2 bg-gray-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Main Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setMainimage(e.target.files[0])}
                className="w-full file:bg-green-600 file:text-white file:rounded file:px-4 file:py-1 file:mr-4 bg-gray-200 p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Gallery Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setPgallery(e.target.files)}
                className="w-full file:bg-green-600 file:text-white file:rounded file:px-4 file:py-1 file:mr-4 bg-gray-200 p-2 rounded"
              />
            </div>
            <div>
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded"
            >
              Update Product
            </button>
          </form>
          {message && <div className="text-auto text-center w-full  text-white px-auto ">{message}</div>}
          </>
        )}

  {/* comments */}
        {selectionType === 'Comments' && (
          <div>
            <h2 className="w-full text-xl font-bold text-white"> All Comments</h2>
            {message && <div className="text-auto text-center w-full  text-white px-auto ">{message}</div>}
            <div className=" w-full h-screen overflow-auto scrollbar-hide flex flex-col justify-start items-start  ">
              {comments.map((c, i) => (
                <div key={i} className="relative bg-white text-black p-3 my-2 rounded w-full p-4">
                  <p className='text-lg'>{c.comment}</p>
                  <p className="text-sm text-gray-700 italic ">- {c.userName}</p>
                  <div className="absolute top-0 right-0 text-white bg-black rounded full w-[20px] h-[20px] flex justify-center items-center hover:bg-red-500" onClick={()=>removeComment(c._id)}>X</div>
                </div>
              ))}
              
            </div>
            {message && <div className="text-auto text-center w-full  text-white px-auto ">{message}</div>}
          </div>
        )}

  {/* Change Password */}
        {selectionType === 'changePassword' && (
          <>
          {message && <div className="text-auto text-center w-full  text-white px-auto ">{message}</div>}
        <form
          onSubmit={handleChangePwd}
          className="max-w-md mx-auto p-6 bg-white shadow-md rounded-xl space-y-5"
        >
          <h2 className="text-2xl font-bold text-gray-800 text-center">🔒 Change Password</h2>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Previous Password</label>
            <input
              type="password"
              placeholder="Enter Previous password"
              value={prevpwd}
              onChange={(e) => setPrevPwd(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmpwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 transition duration-200 text-white font-semibold py-2 px-4 rounded-lg"
          >
            🔁 Change Password
          </button>
        </form>
        {message && <div className="text-auto text-center w-full  text-white px-auto ">{message}</div>}
        </>
        )}
    
      </div>
    </div>
  : <div className='flex justify-center items-center text-3xl text-red-500'>{message}</div>}
  </div>
  );
}


function OrderCard({ order, onAddTracking }) {
  const handleAddTracking = () => {
    const dhltracking = prompt('Enter DHL Tracking Number:');
    if (dhltracking && dhltracking.trim()) {
      onAddTracking(order.orderid, dhltracking.trim());
    }
  };

  return (
    <div className='bg-white p-4 rounded-xl shadow-md w-full  flex-col gap-3 border border-blue-100'>
      <div className='text-blue-800 font-semibold text-lg'>Order date and time</div>
      <div className='text-center'><strong> {convertToPKT(order.createdAt)}</strong></div> 
      <div className='text-blue-800 font-semibold text-lg'>🧾 Order Details</div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
        <div><strong>Order ID:</strong> {order.orderid}</div>
        <div><strong>Total:</strong> ${order.orderprice}</div>
        <div><strong>Shipping Address:</strong> {order.shippingaddress}</div>
        {order.checkoutDHL &&
          <div><strong>Status:</strong> {order.checkoutDHL}</div>
        }
        <div><strong>Status:</strong> {order.status}</div>
        {order.dhltracking && (
          <>
            <div><strong>DHL Tracking:</strong> {order.dhltracking}</div>
            <div><strong>Shipped At:</strong> {order.modifiedAt || order.createdAt}</div>
          </>
        )}
      </div>

      <div className='text-blue-800 font-semibold mt-2 text-lg'>👤 User Info</div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
        <div><strong>User ID:</strong> {order.userid}</div>
        <div><strong>Name:</strong> {order.name}</div>
        <div><strong>Email:</strong> {order.email}</div>
        <div><strong>Contact:</strong> {order.contactno}</div>
      </div>
      {!order.shipped && onAddTracking && (
        <button
          className="mt-4 w-fit px-4 py-5 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          onClick={handleAddTracking}
        >
          ➕ Add DHL Tracking
        </button>
      )}
    </div>
  );
}
function convertToPKT(utcTimestamp) {
  const date = new Date(utcTimestamp);
  const pktOffsetMs = 5 * 60 * 60 * 1000;
  const pktDate = new Date(date.getTime() + pktOffsetMs);
  const yyyy = pktDate.getFullYear();
  const mm = String(pktDate.getMonth() + 1).padStart(2, '0');
  const dd = String(pktDate.getDate()).padStart(2, '0');
  const hh = String(pktDate.getHours()).padStart(2, '0');
  const min = String(pktDate.getMinutes()).padStart(2, '0');
  const ss = String(pktDate.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss} PKT`;
}

