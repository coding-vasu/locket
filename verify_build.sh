#!/bin/bash
set -e

echo "🔍 Starting Build Verification..."

# 1. Type Check & Build
echo "📦 Running production build (TypeScript + Vite)..."
if npm run build; then
    echo "✅ Build Successful!"
else
    echo "❌ Build Failed!"
    exit 1
fi

# 2. Linting
echo "🧹 Running Linter..."
if npm run lint; then
    echo "✅ Linting Passed!"
else
    echo "❌ Linting Failed!"
    exit 1
fi

echo "🎉 All verifications passed! Ready for PR."
exit 0
