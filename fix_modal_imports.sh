#!/bin/bash

# Fix modal imports in screens
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\./ConfirmationModal|from '../modals/ConfirmationModal|g" {} \;
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\./ProfilePictureModal|from '../modals/ProfilePictureModal|g" {} \;
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\./ReportGroupModal|from '../modals/ReportGroupModal|g" {} \;
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\./ThemeSelectionModal|from '../modals/ThemeSelectionModal|g" {} \;
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\./NotificationPermissionPrompt|from '../modals/NotificationPermissionPrompt|g" {} \;
find src/components/screens -name "*.tsx" -exec sed -i "s|from '\./PwaInstallPrompt|from '../modals/PwaInstallPrompt|g" {} \;

# Fix modal imports in layout
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\./ConfirmationModal|from '../modals/ConfirmationModal|g" {} \;
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\./ProfilePictureModal|from '../modals/ProfilePictureModal|g" {} \;
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\./ReportGroupModal|from '../modals/ReportGroupModal|g" {} \;
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\./ThemeSelectionModal|from '../modals/ThemeSelectionModal|g" {} \;
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\./NotificationPermissionPrompt|from '../modals/NotificationPermissionPrompt|g" {} \;
find src/components/layout -name "*.tsx" -exec sed -i "s|from '\./PwaInstallPrompt|from '../modals/PwaInstallPrompt|g" {} \;

# Fix modal imports in ui
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\./ConfirmationModal|from '../modals/ConfirmationModal|g" {} \;
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\./ProfilePictureModal|from '../modals/ProfilePictureModal|g" {} \;
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\./ReportGroupModal|from '../modals/ReportGroupModal|g" {} \;
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\./ThemeSelectionModal|from '../modals/ThemeSelectionModal|g" {} \;
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\./NotificationPermissionPrompt|from '../modals/NotificationPermissionPrompt|g" {} \;
find src/components/ui -name "*.tsx" -exec sed -i "s|from '\./PwaInstallPrompt|from '../modals/PwaInstallPrompt|g" {} \;

echo "Modal imports fixed!"