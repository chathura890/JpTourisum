const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '../src');

// Map Lucide icons to FontAwesome classes
const iconMap = {
  MapPin: 'fas fa-location-dot',
  Phone: 'fas fa-phone',
  Mail: 'fas fa-envelope',
  Globe: 'fas fa-globe',
  Menu: 'fas fa-bars',
  X: 'fas fa-times',
  User: 'fas fa-user',
  Compass: 'fas fa-compass',
  CarFront: 'fas fa-car-side',
  Calendar: 'fas fa-calendar',
  Users: 'fas fa-users',
  Car: 'fas fa-car',
  ShieldCheck: 'fas fa-shield-halved',
  Star: 'fas fa-star',
  Leaf: 'fas fa-leaf',
  Home: 'fas fa-home',
  Crosshair: 'fas fa-crosshairs',
  Camera: 'fas fa-camera',
  RefreshCw: 'fas fa-arrows-rotate',
  Search: 'fas fa-magnifying-glass',
  ChevronDown: 'fas fa-chevron-down',
  ChevronRight: 'fas fa-chevron-right',
  Clock: 'fas fa-clock',
  CreditCard: 'fas fa-credit-card',
  Settings: 'fas fa-gear',
  LogOut: 'fas fa-right-from-bracket',
  Lock: 'fas fa-lock',
  ArrowRight: 'fas fa-arrow-right',
  Briefcase: 'fas fa-briefcase',
  Wind: 'fas fa-wind',
  Check: 'fas fa-check',
  MessageCircle: 'fab fa-whatsapp', // Better match for whatsapp
  Send: 'fas fa-paper-plane',
  Shield: 'fas fa-shield',
  Languages: 'fas fa-language',
  Award: 'fas fa-award',
  Sunrise: 'fas fa-sun',
  Sunset: 'fas fa-moon',
  Filter: 'fas fa-filter'
};

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  
  // Find all Lucide imports to know what icons are used in this file
  const lucideImportRegex = /import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"];?/g;
  const match = lucideImportRegex.exec(content);
  
  if (match) {
    // Remove the import statement
    content = content.replace(lucideImportRegex, '');
    hasChanges = true;
    
    // Get the imported icons
    const importedIcons = match[1].split(',').map(s => s.trim()).filter(s => s);
    
    // Replace each tag: <IconName ...props /> -> <i className="..." ...props></i>
    for (const icon of importedIcons) {
      if (!iconMap[icon]) {
        console.warn(`WARNING: No mapping for ${icon} in ${filePath}`);
        continue;
      }
      
      const faClass = iconMap[icon];
      
      // Regex to match <IconName prop="val" /> or <IconName>
      const tagRegex = new RegExp(`<${icon}(\\s+[^>]*?)?(?:/?)>`, 'g');
      
      content = content.replace(tagRegex, (fullMatch, propsString) => {
        let size = 24; // default
        let className = '';
        let otherProps = '';
        
        if (propsString) {
          // Extract size
          const sizeMatch = propsString.match(/size=\{?['"]?(\d+)['"]?\}?/);
          if (sizeMatch) size = sizeMatch[1];
          
          // Extract className
          const classMatch = propsString.match(/className=(['"])(.*?)\1|className=\{([^}]+)\}/);
          if (classMatch) {
            className = classMatch[2] || classMatch[3] || '';
          }
        }
        
        // Remove size and className from propsString if we extracted them to merge, 
        // but it's complex to regex replace them out safely.
        // Let's just create a clean style and class string.
        let finalClass = `${faClass} ${className}`.trim();
        // Just construct the <i> tag. We'll drop strokeWidth and other lucide-specific props safely this way.
        return `<i className={\`${finalClass.replace(/`/g, '\\`')}\`} style={{fontSize: '${size}px'}}></i>`;
      });
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

processDirectory(directoryPath);
console.log("Done replacing icons!");
