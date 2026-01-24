# Image Assets Reference

This document contains all image URLs used in the application. Download these images and place them in `frontend/src/assets/images/` folder.

## HomePage Hero Slider Images

### Slide 1 - Document Storage
**File Name:** `hero-slide-documents.jpg`
**URL:** https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&h=1080&fit=crop
**Usage:** First slide - About storing documents securely
**Dimensions:** 1920x1080px recommended

### Slide 2 - Smart Notifications
**File Name:** `hero-slide-notifications.jpg`
**URL:** https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1920&h=1080&fit=crop
**Usage:** Second slide - About smart reminders and notifications
**Dimensions:** 1920x1080px recommended

### Slide 3 - Core Functionality
**File Name:** `hero-slide-management.jpg`
**URL:** https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop
**Usage:** Third slide - About managing warranties in one place
**Dimensions:** 1920x1080px recommended

## Login Page Images

### Login Hero Image
**File Name:** `login-hero.jpg`
**URL:** https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop
**Usage:** Left side image on login page
**Dimensions:** 800x600px recommended
**Alternative:** https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop

## Registration Page Images

### Registration Hero Image
**File Name:** `register-hero.jpg`
**URL:** https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop
**Usage:** Left side image on registration page
**Dimensions:** 800x600px recommended
**Alternative:** https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop

## Login Page Images

### Login Hero Image
**File Name:** `login-hero.jpg`
**URL:** https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop
**Usage:** Left side image on login page
**Dimensions:** 800x600px recommended
**Alternative:** https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop

## Registration Page Images

### Registration Hero Image
**File Name:** `register-hero.jpg`
**URL:** https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop
**Usage:** Left side image on registration page
**Dimensions:** 800x600px recommended
**Alternative:** https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop

## Image Suggestions (Optional - for future use)

### Feature Images
1. **Security Feature:** https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop
2. **Mobile Access:** https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop
3. **Notifications:** https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop

### Dashboard Placeholder
**File Name:** `dashboard-placeholder.jpg`
**URL:** https://images.unsplash.com/photo-1554224154-26032c5fd44d?w=1200&h=800&fit=crop

## Instructions

1. Download all images from the URLs above
2. Save them in `frontend/src/assets/images/` folder
3. Update the image paths in the components to use the local assets:
   - Change `/src/assets/images/hero-warranty.jpg` to `../assets/images/hero-warranty.jpg` (relative import)
   - Or use: `import heroImage from '../assets/images/hero-warranty.jpg'`

## Image Optimization Tips

- Compress images before adding to reduce bundle size
- Use WebP format for better compression (convert from JPG/PNG)
- Recommended max file size: 200KB per image
- Use tools like TinyPNG or Squoosh for optimization

