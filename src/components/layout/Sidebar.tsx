'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: '📊 Dashboard', href: '/' },
  { name: '👥 Usuários', href: '/users' },
  { name: '📱 Aplicações', href: '/apps' },
  { name: '📝 Logs', href: '/logs' },
  { name: '⚙️ Configurações', href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4 fixed left-0 top-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">🎨 xCloud</h1>
        <p className="text-sm text-gray-400">Dashboard Admin</p>
      </div>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-xs text-gray-400">🔗 Documentação</p>
          <a
            href="https://pagecloudv1.github.io/xcloud-docs/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            pagecloudv1.github.io/xcloud-docs
          </a>
        </div>
      </div>
    </aside>
  );
}
