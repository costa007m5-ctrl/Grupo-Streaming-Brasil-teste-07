#!/bin/bash

# Fix UI component imports in screens
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\./FeaturedCarousel|from '../ui/FeaturedCarousel|g" {} \;
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\./ImageCarousel|from '../ui/ImageCarousel|g" {} \;
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\./CategoryTabsCarousel|from '../ui/CategoryTabsCarousel|g" {} \;
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\./ServiceCategoryCarousel|from '../ui/ServiceCategoryCarousel|g" {} \;
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\./TopServicesCarousel|from '../ui/TopServicesCarousel|g" {} \;
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\./AdvertisingView|from '../ui/AdvertisingView|g" {} \;

# Fix UI component imports in layout
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\./FeaturedCarousel|from '../ui/FeaturedCarousel|g" {} \;
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\./ImageCarousel|from '../ui/ImageCarousel|g" {} \;
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\./CategoryTabsCarousel|from '../ui/CategoryTabsCarousel|g" {} \;
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\./ServiceCategoryCarousel|from '../ui/ServiceCategoryCarousel|g" {} \;
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\./TopServicesCarousel|from '../ui/TopServicesCarousel|g" {} \;
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\./AdvertisingView|from '../ui/AdvertisingView|g" {} \;

# Fix UI component imports in modals
find src/components/modals -name "*.tsx" -exec sed -i "s|from '\./FeaturedCarousel|from '../ui/FeaturedCarousel|g" {} \;
find src/components/modals -name "*.tsx" -exec sed -i "s|from '\./ImageCarousel|from '../ui/ImageCarousel|g" {} \;
find src/components/modals -name "*.tsx" -exec sed -i "s|from '\./CategoryTabsCarousel|from '../ui/CategoryTabsCarousel|g" {} \;
find src/components/modals -name "*.tsx" -exec sed -i "s|from '\./ServiceCategoryCarousel|from '../ui/ServiceCategoryCarousel|g" {} \;
find src/components/modals -name "*.tsx" -exec sed -i "s|from '\./TopServicesCarousel|from '../ui/TopServicesCarousel|g" {} \;
find src/components/modals -name "\./AdvertisingView|from '../ui/AdvertisingView|g" {} \;

# Fix UI component imports in ui
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\./FeaturedCarousel|from './FeaturedCarousel|g" {} \;
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\./ImageCarousel|from './ImageCarousel|g" {} \;
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\./CategoryTabsCarousel|from './CategoryTabsCarousel|g" {} \;
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\./ServiceCategoryCarousel|from './ServiceCategoryCarousel|g" {} \;
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\./TopServicesCarousel|from './TopServicesCarousel|g" {} \;
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\./AdvertisingView|from './AdvertisingView|g" {} \;

echo "UI component imports fixed!"