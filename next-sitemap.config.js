/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://royalfoldforge.com', 
  generateRobotsTxt: true,           
  generateIndexSitemap: true,        
  exclude: ['/adminlogin/*', '/addProducts/*'],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',      
        allow: '/',         
        disallow: ['/adminlogin', '/addProducts'], 
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/no-google'], 
      },
    ],
    additionalSitemaps: [
      'https://royalfoldforge.com/sitemap.xml',
    ],
  },
};
