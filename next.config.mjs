/** @type {import('next').NextConfig} */
const nextConfig = {
    crossOrigin: 'anonymous',
   
        rules: {
          '@typescript-eslint/no-explicit-any': 'off', // Disable the rule
          '@typescript-eslint/no-unused-vars': ['warn'], // Change from error to warning
        },
     
      
};

export default nextConfig;
