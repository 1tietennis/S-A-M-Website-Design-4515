// Comprehensive Syntax and Code Quality Checker
const SyntaxChecker = {
    errors: [],
    warnings: [],
    suggestions: [],

    // Main checking function
    runCompleteCheck() {
        console.log('🔍 RUNNING COMPREHENSIVE SYNTAX CHECK');
        console.log('=====================================');
        
        this.errors = [];
        this.warnings = [];
        this.suggestions = [];

        // Run all checks
        this.checkHTMLStructure();
        this.checkCSSIssues();
        this.checkJavaScriptSyntax();
        this.checkFileReferences();
        this.checkBestPractices();
        this.checkPerformanceIssues();
        
        // Generate report
        this.generateReport();
    },

    // HTML Structure Check
    checkHTMLStructure() {
        console.log('🔍 Checking HTML structure...');
        
        try {
            // Check DOCTYPE
            if (!document.doctype) {
                this.errors.push('HTML: Missing DOCTYPE declaration');
            }

            // Check required elements
            if (!document.head) {
                this.errors.push('HTML: Missing <head> element');
            }
            if (!document.body) {
                this.errors.push('HTML: Missing <body> element');
            }

            // Check meta tags
            const charset = document.querySelector('meta[charset]');
            if (!charset) {
                this.warnings.push('HTML: Missing charset meta tag');
            }

            const viewport = document.querySelector('meta[name="viewport"]');
            if (!viewport) {
                this.warnings.push('HTML: Missing viewport meta tag');
            }

            // Check for empty elements
            const emptyElements = document.querySelectorAll(':empty:not(br):not(hr):not(img):not(input):not(meta):not(link)');
            if (emptyElements.length > 5) {
                this.warnings.push(`HTML: Found ${emptyElements.length} potentially unnecessary empty elements`);
            }

            // Check for duplicate IDs
            const allIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
            const duplicateIds = allIds.filter((id, index) => allIds.indexOf(id) !== index);
            if (duplicateIds.length > 0) {
                this.errors.push(`HTML: Duplicate IDs found: ${duplicateIds.join(', ')}`);
            }

            // Check for accessibility issues
            const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
            if (imagesWithoutAlt.length > 0) {
                this.warnings.push(`HTML: ${imagesWithoutAlt.length} images missing alt attributes`);
            }

            const buttonsWithoutText = Array.from(document.querySelectorAll('button')).filter(btn => 
                !btn.textContent.trim() && !btn.getAttribute('aria-label')
            );
            if (buttonsWithoutText.length > 0) {
                this.warnings.push(`HTML: ${buttonsWithoutText.length} buttons missing accessible text`);
            }

            console.log('✅ HTML structure check completed');
        } catch (error) {
            this.errors.push(`HTML: Structure check failed - ${error.message}`);
        }
    },

    // CSS Issues Check
    checkCSSIssues() {
        console.log('🔍 Checking CSS issues...');
        
        try {
            // Check stylesheet loading
            const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
            stylesheets.forEach((sheet, index) => {
                if (sheet.sheet === null) {
                    this.errors.push(`CSS: Stylesheet ${index + 1} failed to load: ${sheet.href}`);
                }
            });

            // Check for inline styles (performance concern)
            const inlineStyles = document.querySelectorAll('[style]');
            if (inlineStyles.length > 10) {
                this.warnings.push(`CSS: ${inlineStyles.length} elements with inline styles (consider moving to CSS classes)`);
            }

            // Check for CSS loading blocking
            const blockingStyles = document.querySelectorAll('link[rel="stylesheet"]:not([media])');
            if (blockingStyles.length > 3) {
                this.suggestions.push(`CSS: ${blockingStyles.length} render-blocking stylesheets (consider critical CSS)`);
            }

            // Test CSS custom properties support
            const supportsCustomProps = CSS.supports && CSS.supports('color', 'var(--test)');
            if (!supportsCustomProps) {
                this.warnings.push('CSS: CSS custom properties not supported in this browser');
            }

            console.log('✅ CSS issues check completed');
        } catch (error) {
            this.errors.push(`CSS: Issues check failed - ${error.message}`);
        }
    },

    // JavaScript Syntax and Runtime Check
    checkJavaScriptSyntax() {
        console.log('🔍 Checking JavaScript syntax and runtime...');
        
        try {
            // Check for global variables
            const globalKeys = Object.keys(window).filter(key => 
                !['console', 'document', 'window', 'navigator', 'location', 'history'].includes(key) &&
                !key.startsWith('webkit') && !key.startsWith('moz') && !key.startsWith('ms') &&
                typeof window[key] !== 'function' || key.includes('Test') || key.includes('Debug')
            );
            if (globalKeys.length > 20) {
                this.warnings.push(`JS: ${globalKeys.length} global variables detected (potential namespace pollution)`);
            }

            // Check for modern JavaScript features
            const modernFeatures = {
                'Arrow Functions': () => (() => {})(),
                'Template Literals': () => `test`,
                'Destructuring': () => { const {a} = {a: 1}; return a; },
                'Promises': () => Promise.resolve(true),
                'Fetch API': () => typeof fetch === 'function',
                'Async/Await': () => { async function test() { return true; } return test; }
            };

            Object.entries(modernFeatures).forEach(([feature, test]) => {
                try {
                    const result = test();
                    if (!result) {
                        this.warnings.push(`JS: ${feature} not supported or not working`);
                    }
                } catch (error) {
                    this.warnings.push(`JS: ${feature} failed - ${error.message}`);
                }
            });

            // Check for potential memory leaks
            const eventListeners = [];
            const originalAddEventListener = EventTarget.prototype.addEventListener;
            EventTarget.prototype.addEventListener = function(type, listener, options) {
                eventListeners.push({ target: this, type, listener });
                return originalAddEventListener.call(this, type, listener, options);
            };
            
            // Restore original after brief monitoring
            setTimeout(() => {
                EventTarget.prototype.addEventListener = originalAddEventListener;
                if (eventListeners.length > 50) {
                    this.warnings.push(`JS: ${eventListeners.length} event listeners detected (check for potential memory leaks)`);
                }
            }, 1000);

            // Check for console errors in the last few seconds
            const originalError = console.error;
            let recentErrors = 0;
            console.error = function(...args) {
                recentErrors++;
                return originalError.apply(console, args);
            };
            
            setTimeout(() => {
                console.error = originalError;
                if (recentErrors > 0) {
                    this.errors.push(`JS: ${recentErrors} console errors detected during check`);
                }
            }, 2000);

            // Check strict mode
            const isStrictMode = (function() { return !this; })();
            if (!isStrictMode) {
                this.suggestions.push('JS: Consider enabling strict mode ("use strict")');
            }

            console.log('✅ JavaScript syntax check completed');
        } catch (error) {
            this.errors.push(`JS: Syntax check failed - ${error.message}`);
        }
    },

    // File References Check
    checkFileReferences() {
        console.log('🔍 Checking file references...');
        
        try {
            // Check script sources
            const scripts = document.querySelectorAll('script[src]');
            scripts.forEach((script, index) => {
                const src = script.src;
                
                // Check for proper protocols
                if (src.startsWith('http://') && location.protocol === 'https:') {
                    this.warnings.push(`Files: Mixed content - HTTP script in HTTPS page: ${src}`);
                }
                
                // Check for suspicious paths
                if (src.includes('../') && src.split('../').length > 3) {
                    this.warnings.push(`Files: Deep relative path in script ${index + 1}: ${src}`);
                }
                
                // Check for missing files (basic check)
                if (!src.startsWith('http') && !src.startsWith('/') && !src.startsWith('./')) {
                    this.warnings.push(`Files: Potentially invalid script path: ${src}`);
                }
            });

            // Check link references
            const links = document.querySelectorAll('link[href]');
            links.forEach((link, index) => {
                const href = link.href;
                
                if (href.startsWith('http://') && location.protocol === 'https:') {
                    this.warnings.push(`Files: Mixed content - HTTP link in HTTPS page: ${href}`);
                }
            });

            // Check for broken images
            const images = document.querySelectorAll('img');
            images.forEach((img, index) => {
                img.onerror = () => {
                    this.errors.push(`Files: Image failed to load: ${img.src}`);
                };
            });

            console.log('✅ File references check completed');
        } catch (error) {
            this.errors.push(`Files: Reference check failed - ${error.message}`);
        }
    },

    // Best Practices Check
    checkBestPractices() {
        console.log('🔍 Checking best practices...');
        
        try {
            // Check for SEO basics
            const title = document.querySelector('title');
            if (!title || title.textContent.length < 10) {
                this.warnings.push('SEO: Page title missing or too short');
            }
            
            const description = document.querySelector('meta[name="description"]');
            if (!description || description.content.length < 50) {
                this.warnings.push('SEO: Meta description missing or too short');
            }

            // Check for accessibility
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            const h1Count = document.querySelectorAll('h1').length;
            if (h1Count === 0) {
                this.warnings.push('Accessibility: No H1 heading found');
            } else if (h1Count > 1) {
                this.warnings.push('Accessibility: Multiple H1 headings found');
            }

            // Check for form labels
            const inputs = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"])');
            const inputsWithoutLabels = Array.from(inputs).filter(input => {
                const id = input.id;
                return !id || !document.querySelector(`label[for="${id}"]`);
            });
            if (inputsWithoutLabels.length > 0) {
                this.warnings.push(`Accessibility: ${inputsWithoutLabels.length} form inputs without associated labels`);
            }

            // Check for performance
            const largeImages = Array.from(document.querySelectorAll('img')).filter(img => {
                return img.naturalWidth > 2000 || img.naturalHeight > 2000;
            });
            if (largeImages.length > 0) {
                this.suggestions.push(`Performance: ${largeImages.length} large images detected (consider optimization)`);
            }

            // Check for external resource optimization
            const externalScripts = document.querySelectorAll('script[src^="http"]');
            const externalLinks = document.querySelectorAll('link[href^="http"]');
            if (externalScripts.length + externalLinks.length > 10) {
                this.suggestions.push(`Performance: ${externalScripts.length + externalLinks.length} external resources (consider bundling)`);
            }

            console.log('✅ Best practices check completed');
        } catch (error) {
            this.errors.push(`Best Practices: Check failed - ${error.message}`);
        }
    },

    // Performance Issues Check
    checkPerformanceIssues() {
        console.log('🔍 Checking performance issues...');
        
        try {
            // Check page load time
            if (performance && performance.timing) {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                if (loadTime > 3000) {
                    this.warnings.push(`Performance: Page load time is ${loadTime}ms (consider optimization)`);
                }
            }

            // Check DOM size
            const domElements = document.querySelectorAll('*').length;
            if (domElements > 1500) {
                this.warnings.push(`Performance: Large DOM size (${domElements} elements)`);
            }

            // Check for render-blocking resources
            const renderBlockingScripts = document.querySelectorAll('script:not([async]):not([defer])');
            if (renderBlockingScripts.length > 3) {
                this.suggestions.push(`Performance: ${renderBlockingScripts.length} render-blocking scripts (consider async/defer)`);
            }

            // Check for unused CSS (basic check)
            const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
            if (stylesheets.length > 5) {
                this.suggestions.push(`Performance: ${stylesheets.length} stylesheets (consider concatenation)`);
            }

            console.log('✅ Performance issues check completed');
        } catch (error) {
            this.errors.push(`Performance: Issues check failed - ${error.message}`);
        }
    },

    // Generate comprehensive report
    generateReport() {
        console.log('\n📊 COMPREHENSIVE SYNTAX & QUALITY REPORT');
        console.log('=========================================');
        
        const totalIssues = this.errors.length + this.warnings.length;
        const score = Math.max(0, 100 - (this.errors.length * 10) - (this.warnings.length * 5));
        
        console.log(`📈 Overall Score: ${score}/100`);
        console.log(`🔴 Critical Errors: ${this.errors.length}`);
        console.log(`🟡 Warnings: ${this.warnings.length}`);
        console.log(`💡 Suggestions: ${this.suggestions.length}`);
        
        if (this.errors.length > 0) {
            console.log('\n🔴 CRITICAL ERRORS (Must Fix):');
            this.errors.forEach((error, index) => {
                console.log(`${index + 1}. ${error}`);
            });
        }
        
        if (this.warnings.length > 0) {
            console.log('\n🟡 WARNINGS (Should Fix):');
            this.warnings.forEach((warning, index) => {
                console.log(`${index + 1}. ${warning}`);
            });
        }
        
        if (this.suggestions.length > 0) {
            console.log('\n💡 SUGGESTIONS (Nice to Have):');
            this.suggestions.forEach((suggestion, index) => {
                console.log(`${index + 1}. ${suggestion}`);
            });
        }
        
        if (totalIssues === 0) {
            console.log('\n🎉 NO ISSUES FOUND! Code quality is excellent.');
        } else {
            console.log(`\n📋 Total Issues Found: ${totalIssues}`);
            console.log('🔧 Focus on fixing critical errors first');
        }
        
        console.log('\n🔍 Run this check regularly to maintain code quality');
        
        return {
            score,
            errors: this.errors,
            warnings: this.warnings,
            suggestions: this.suggestions,
            totalIssues
        };
    }
};

// Make it globally available for testing
if (typeof window !== 'undefined') {
    window.SyntaxChecker = SyntaxChecker;
    
    // Auto-run check after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            console.log('🔍 Running automatic syntax check...');
            SyntaxChecker.runCompleteCheck();
        }, 2000);
    });
}

export default SyntaxChecker;