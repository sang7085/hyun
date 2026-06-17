import PlusIcon from '@/app/components/icon/PlusIcon';

export default function Header() {
  return (
    <header className="header">
      <div className="inner">
        <h1 className="logo">HYUN.</h1>
        <nav>
          <ul>
            <li><a href="
            #work">VISUAL</a></li>
            <li><a href="#work">WORK</a></li>
            <li><a href="#about">ABOUT</a></li>
            <li><a href="#contact">CONTACT</a></li>
          </ul>
        </nav>
        <PlusIcon />
      </div>
    </header>
  );
}