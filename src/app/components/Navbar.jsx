

import Link from 'next/link';
import Image from 'next/image';
import Logo from '../images/Logo.png'; 
const Header = () => {
  return (
    <header className="text-black body-font shadow-lg py-3">
      <div className="container mx-auto flex flex-wrap flex-col md:flex-row items-center">
      <Image
        src={Logo}
        width={120}
        height={10}
        alt={Logo}
        
      />
        <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
          <Link href="/" className="mr-5 hover:text-red-600 cursor-pointer">Text Sharer</Link>
          <Link href="../Storage" className="mr-5 hover:text-red-600 cursor-pointer" >Media Sharer</Link>
          
        </nav>
        
      </div>
    </header>
  );
};

export default Header;

