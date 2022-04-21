export const useHref = (): Record<string, any> => {
    // 使用window来切换路由，可以直接干掉所有ThreeJS的残留对象，保护内存
    const jump = (path: string): void => {
        const p = window.location.href.split('/');
        p[p.length - 1] = path;
        window.location.href = p.join('/');
    };

    const jug = (path: string): boolean => {
        const p = window.location.pathname.split('/');
        const pathname = p[p.length - 1];
        return path === pathname;
    };

    return {
        jump,
        jug
    };
};
