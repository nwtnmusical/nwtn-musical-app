import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Twitter, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-primary to-secondary text-white mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">NWTN MUSICAL</h3>
            <p className="text-accent">
              Experience the rhythm of quality music. Your premier destination for the best tracks and videos.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/songs" className="text-accent hover:text-white transition-colors">
                  Songs
                </Link>
              </li>
              <li>
                <Link to="/videos" className="text-accent hover:text-white transition-colors">
                  Videos
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-accent hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-accent">
                <Mail size={16} />
                <span>contact@nwtnmusical.com</span>
              </li>
              <li className="flex items-center space-x-2 text-accent">
                <Phone size={16} />
                <span>+1 234 567 890</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-all"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-all"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-all"
              >
                <Youtube size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-all"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white border-opacity-20 mt-8 pt-8 text-center text-accent">
          <p>&copy; {currentYear} NWTN MUSICAL. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
