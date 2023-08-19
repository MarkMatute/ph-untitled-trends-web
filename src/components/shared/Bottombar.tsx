'use client';

import Link from 'next/link';
import { sidebarLinks } from '../../constants';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

function Bottombar() {
  const pathname = usePathname();

  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map((link) => {
          const { route, label, imgURL } = link;
          const isActive =
            (pathname.includes(route) && route.length > 1) ||
            pathname === route;
          return (
            <Link
              key={route}
              href={route}
              className={`bottombar_link ${isActive && 'bg-primary-500'}`}
            >
              <Image src={imgURL} alt={label} width={24} height={24} />
              <p className="text-subtle-medium text-light-1 max-sm:hidden">
                {label.split(' ')}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default Bottombar;
