import Link from 'next/link';
import React from 'react';
import { Offcanvas } from 'react-bootstrap';
import Collapsible from 'react-collapsible';



const SidebarMenu = ({ show, handleClose }) => {

   return (
      <>

         <div >
            <Offcanvas show={show} onHide={handleClose} placement='end' className='side__bar'>
               <Offcanvas.Header closeButton>
                  <div className="logo">
                     <Link href="/home">
                        <a>
                           <img src="assets/img/logo/HD.png" alt="logo" />
                        </a>
                     </Link>
                  </div>
               </Offcanvas.Header>

               <Offcanvas.Body>

                  <div className="">
                     <div className="">

                        <div className="sidebar__content">

                           <div className="mobile-menu">
                              <nav id="mobile-menu">
                                 <ul>
                                 <div className='single_link iconAdd '>
                                       <li><Link href="/"><a>Home</a></Link></li>
                                    </div>

                                    


                                    <Collapsible trigger={<Link href="/product">Pages</Link>} triggerTagName="div"
                                       triggerOpenedClassName="icon_close" triggerClassName="iconAdd" open={false}>
                                       <ul className="sidebar_sub_menu submenu text-white">
                                          <li><Link href="/about"><a >About</a></Link></li>
                                          
                                       </ul>
                                    </Collapsible>
                                    <Collapsible trigger={<Link href="/calcula">Calculator</Link>} triggerTagName="div"
                                       triggerOpenedClassName="icon_close" triggerClassName="iconAdd" open={false}>
                                       <ul className="sidebar_sub_menu submenu text-white">
                                          <li><Link href="/calculator"><a >Calculator</a></Link></li>
                                          <li><Link href="/calc-details"><a >Calc Details</a></Link></li>
                                       </ul>
                                    </Collapsible>

                                    <Collapsible trigger={<Link href="/blog">Blog</Link>} triggerTagName="div"
                                       triggerOpenedClassName="icon_close" triggerClassName="iconAdd" open={false}>
                                       <ul className="sidebar_sub_menu submenu text-white">
                                          <li><Link href="/blog"><a >Blog</a></Link></li>
                                          <li><Link href="/blog-details"><a >Blog Details</a></Link></li>
                                       </ul>
                                    </Collapsible>

                                    <div className='single_link iconAdd border-0'>
                                       <li><Link href="/contact"><a >Contact</a></Link></li>
                                    </div>

                                 </ul>
                              </nav>
                           </div>

                           
                        </div>
                     </div>
                  </div>

               </Offcanvas.Body>
            </Offcanvas>
         </div>
      </>
   );
};

export default SidebarMenu;