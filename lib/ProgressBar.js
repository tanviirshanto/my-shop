'use client';

import { useEffect, useRef } from 'react'; import { usePathname } from 'next/navigation'; import NProgress from 'nprogress'; import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false });

const ProgressBar = () => { const pathname = usePathname(); const previousPath = useRef(pathname);

useEffect(() => { if (previousPath.current !== pathname) { NProgress.start(); NProgress.done(); previousPath.current = pathname; } }, [pathname]);

return null; };

export default ProgressBar;