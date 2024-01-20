import Link from 'next/link';


const Footer = () => {
  return (
    <footer className=" text-black py-4 ">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <p className="text-lg font-bold">SaylaniStormWare</p>
          <p className="text-sm">Made Under SMIT Supervision</p>
        </div>
        <div className="flex space-x-4">
          <Link href="/" className="hover:text-gray-500">Home</Link>
          <Link href="/" className="hover:text-gray-500">About</Link>
          <Link href="/" className="hover:text-gray-500">Contact</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
