#!/bin/bash

# Fix remaining imports in screens
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\./Header|from '../layout/Header|g" {} \;
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\./BalanceCard|from '../ui/BalanceCard|g" {} \;
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\./QuickActions|from '../layout/QuickActions|g" {} \;
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\./MyGroups|from '../layout/MyGroups|g" {} \;
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\./RecentActivity|from '../layout/RecentActivity|g" {} \;
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\./RecommendedGroups|from '../layout/RecommendedGroups|g" {} \;
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\./BottomNav|from '../layout/BottomNav|g" {} \;
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\./Toast|from '../ui/Toast|g" {} \;
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\./Icons|from '../ui/Icons|g" {} \;
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\./DevMenu|from '../ui/DevMenu|g" {} \;

# Fix remaining imports in modals
find src/components/modals -name "*.tsx" -exec sed -i "s|from '\./Header|from '../layout/Header|g" {} \;
find src/components/modals -name "*.tsx" -exec sed -i "s|from '\./BalanceCard|from '../ui/BalanceCard|g" {} \;
find src/components/modals -name "*.tsx" -exec sed -i "s|from '\./QuickActions|from '../layout/QuickActions|g" {} \;
find src/components/modals -name "*.tsx" -exec sed -i "s|from '\./MyGroups|from '../layout/MyGroups|g" {} \;
find src/components/modals -name "*.tsx" -exec sed -i "s|from '\./RecentActivity|from '../layout/RecentActivity|g" {} \;
find src/components/modals -name "*.tsx" -exec sed -i "s|from '\./RecommendedGroups|from '../layout/RecommendedGroups|g" {} \;
find src/components/modals -name "*.tsx" -exec sed -i "s|from '\./BottomNav|from '../layout/BottomNav|g" {} \;
find src/components/modals -name "*.tsx" -exec sed -i "s|from '\./Toast|from '../ui/Toast|g" {} \;
find src/components/modals -name "*.tsx" -exec sed -i "s|from '\./Icons|from '../ui/Icons|g" {} \;
find src/components/modals -name "*.tsx" -exec sed -i "s|from '\./DevMenu|from '../ui/DevMenu|g" {} \;

# Fix remaining imports in layout
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\./Header|from './Header|g" {} \;
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\./BalanceCard|from '../ui/BalanceCard|g" {} \;
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\./QuickActions|from './QuickActions|g" {} \;
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\./MyGroups|from './MyGroups|g" {} \;
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\./RecentActivity|from './RecentActivity|g" {} \;
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\./RecommendedGroups|from './RecommendedGroups|g" {} \;
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\./BottomNav|from './BottomNav|g" {} \;
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\./Toast|from '../ui/Toast|g" {} \;
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\./Icons|from '../ui/Icons|g" {} \;
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\./DevMenu|from '../ui/DevMenu|g" {} \;

# Fix remaining imports in ui
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\./Header|from '../layout/Header|g" {} \;
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\./BalanceCard|from './BalanceCard|g" {} \;
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\./QuickActions|from '../layout/QuickActions|g" {} \;
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\./MyGroups|from '../layout/MyGroups|g" {} \;
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\./RecentActivity|from '../layout/RecentActivity|g" {} \;
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\./RecommendedGroups|from '../layout/RecommendedGroups|g" {} \;
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\./BottomNav|from '../layout/BottomNav|g" {} \;
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\./Toast|from './Toast|g" {} \;
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\./Icons|from './Icons|g" {} \;
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\./DevMenu|from './DevMenu|g" {} \;

echo "Remaining imports fixed!"