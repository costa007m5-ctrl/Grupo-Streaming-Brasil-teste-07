#!/bin/bash

# Update imports in all TSX files
find src -name "*.tsx" -exec sed -i "s|from '\.\./lib/|from '../../lib/|g" {} \;
find src -name "*.tsx" -exec sed -i "s|from '\.\./constants|from '../../utils|g" {} \;
find src -name "*.tsx" -exec sed -i "s|from '\.\./types|from '../../types|g" {} \;
find src -name "*.tsx" -exec sed -i "s|from '\.\./contexts|from '../../contexts|g" {} \;
find src -name "*.tsx" -exec sed -i "s|from '\.\./Icons|from '../ui/Icons|g" {} \;
find src -name "*.tsx" -exec sed -i "s|from '\.\./Toast|from '../ui/Toast|g" {} \;
find src -name "*.tsx" -exec sed -i "s|from '\.\./DevMenu|from '../ui/DevMenu|g" {} \;
find src -name "*.tsx" -exec sed -i "s|from '\.\./BottomNav|from '../layout/BottomNav|g" {} \;
find src -name "*.tsx" -exec sed -i "s|from '\.\./Header|from '../layout/Header|g" {} \;
find src -name "*.tsx" -exec sed -i "s|from '\.\./QuickActions|from '../layout/QuickActions|g" {} \;
find src -name "*.tsx" -exec sed -i "s|from '\.\./RecentActivity|from '../layout/RecentActivity|g" {} \;
find src -name "*.tsx" -exec sed -i "s|from '\.\./RecommendedGroups|from '../layout/RecommendedGroups|g" {} \;
find src -name "*.tsx" -exec sed -i "s|from '\.\./MyGroups|from '../layout/MyGroups|g" {} \;

# Update imports in components/screens
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\.\./lib/|from '../../lib/|g" {} \;
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\.\./constants|from '../../utils|g" {} \;
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\.\./types|from '../../types|g" {} \;
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\.\./contexts|from '../../contexts|g" {} \;
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\.\./Icons|from '../ui/Icons|g" {} \;
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\.\./Toast|from '../ui/Toast|g" {} \;
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\.\./DevMenu|from '../ui/DevMenu|g" {} \;
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\.\./BottomNav|from '../layout/BottomNav|g" {} \;
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\.\./Header|from '../layout/Header|g" {} \;
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\.\./QuickActions|from '../layout/QuickActions|g" {} \;
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\.\./RecentActivity|from '../layout/RecentActivity|g" {} \;
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\.\./RecommendedGroups|from '../layout/RecommendedGroups|g" {} \;
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\.\./MyGroups|from '../layout/MyGroups|g" {} \;

# Update imports in components/modals
find src/components/modals -name "*.tsx" -exec sed -i "s|from '\.\./lib/|from '../../lib/|g" {} \;
find src/components/modals -name "*.tsx" -exec sed -i "s|from '\.\./constants|from '../../utils|g" {} \;
find src/components/modals -name "*.tsx" -exec sed -i "s|from '\.\./types|from '../../types|g" {} \;
find src/components/modals -name "*.tsx" -exec sed -i "s|from '\.\./contexts|from '../../contexts|g" {} \;
find src/components/modals -name "*.tsx" -exec sed -i "s|from '\.\./Icons|from '../ui/Icons|g" {} \;
find src/components/modals -name "*.tsx" -exec sed -i "s|from '\.\./Toast|from '../ui/Toast|g" {} \;
find src/components/modals -name "*.tsx" -exec sed -i "s|from '\.\./DevMenu|from '../ui/DevMenu|g" {} \;
find src/components/modals -name "*.tsx" -exec sed -i "s|from '\.\./BottomNav|from '../layout/BottomNav|g" {} \;
find src/components/modals -name "*.tsx" -exec sed -i "s|from '\.\./Header|from '../layout/Header|g" {} \;
find src/components/modals -name "*.tsx" -exec sed -i "s|from '\.\./QuickActions|from '../layout/QuickActions|g" {} \;
find src/components/modals -name "*.tsx" -exec sed -i "s|from '\.\./RecentActivity|from '../layout/RecentActivity|g" {} \;
find src/components/modals -name "*.tsx" -exec sed -i "s|from '\.\./RecommendedGroups|from '../layout/RecommendedGroups|g" {} \;
find src/components/modals -name "*.tsx" -exec sed -i "s|from '\.\./MyGroups|from '../layout/MyGroups|g" {} \;

# Update imports in components/layout
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\.\./lib/|from '../../lib/|g" {} \;
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\.\./constants|from '../../utils|g" {} \;
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\.\./types|from '../../types|g" {} \;
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\.\./contexts|from '../../contexts|g" {} \;
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\.\./Icons|from '../ui/Icons|g" {} \;
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\.\./Toast|from '../ui/Toast|g" {} \;
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\.\./DevMenu|from '../ui/DevMenu|g" {} \;
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\.\./BottomNav|from '../layout/BottomNav|g" {} \;
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\.\./Header|from '../layout/Header|g" {} \;
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\.\./QuickActions|from '../layout/QuickActions|g" {} \;
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\.\./RecentActivity|from '../layout/RecentActivity|g" {} \;
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\.\./RecommendedGroups|from '../layout/RecommendedLayout|g" {} \;
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\.\./MyGroups|from '../layout/MyGroups|g" {} \;

# Update imports in components/ui
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\.\./lib/|from '../../lib/|g" {} \;
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\.\./constants|from '../../utils|g" {} \;
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\.\./types|from '../../types|g" {} \;
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\.\./contexts|from '../../contexts|g" {} \;
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\.\./Icons|from './Icons|g" {} \;
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\.\./Toast|from './Toast|g" {} \;
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\.\./DevMenu|from './DevMenu|g" {} \;
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\.\./BottomNav|from '../layout/BottomNav|g" {} \;
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\.\./Header|from '../layout/Header|g" {} \;
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\.\./QuickActions|from '../layout/QuickActions|g" {} \;
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\.\./RecentActivity|from '../layout/RecentActivity|g" {} \;
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\.\./RecommendedGroups|from '../layout/RecommendedGroups|g" {} \;
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\.\./MyGroups|from '../layout/MyGroups|g" {} \;

echo "Imports updated successfully!"