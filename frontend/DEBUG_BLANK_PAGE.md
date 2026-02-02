# Debugging Blank Page Issue

## Steps to Debug:

1. **Open Browser Console (F12)**
   - Check for any red error messages
   - Look for console.log messages:
     - "Bootstrap starting..."
     - "Application bootstrapped successfully"
     - "AppComponent initialized"
     - "ProductListComponent initialized"

2. **Check Network Tab**
   - Look for failed requests (red)
   - Check if component files are loading (chunk files)

3. **Check Elements Tab**
   - Right-click on the page → Inspect
   - Look for `<app-root>` element
   - Check if it has any content inside

4. **Try Direct Routes**
   - http://localhost:4200/auth/login
   - http://localhost:4200/products
   - http://localhost:4200/auth/register

5. **Check if Material Theme is the Issue**
   - The Material theme import might be failing
   - Try commenting out the @import in styles.scss temporarily

## Common Issues:

- **CORS Error**: Backend needs to allow frontend origin
- **Component Loading Error**: Lazy-loaded components might fail to load
- **Material Theme Error**: Theme CSS file not found
- **JavaScript Error**: Check console for specific errors

## Quick Fixes:

1. **If you see "Bootstrap starting..." but nothing else:**
   - Component might be failing to load
   - Check product-list component for errors

2. **If you see nothing in console:**
   - JavaScript might not be loading
   - Check Network tab for 404 errors

3. **If Material components look broken:**
   - Theme import is the issue
   - We'll fix the theme after confirming app works
