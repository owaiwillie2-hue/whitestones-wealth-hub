import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <img src={logo} alt="Whitestones Markets" className="h-10 mb-4 brightness-0 invert" />
            <p className="text-primary-foreground/80 mb-4">
              Your trusted partner in building wealth through smart investments
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-fast">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-fast">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-fast">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-fast">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="text-primary-foreground/80 hover:text-primary-foreground transition-fast">About Us</a></li>
              <li><a href="#investments" className="text-primary-foreground/80 hover:text-primary-foreground transition-fast">Investment Options</a></li>
              <li><Link to="/signup" className="text-primary-foreground/80 hover:text-primary-foreground transition-fast">Open Account</Link></li>
              <li><Link to="/login" className="text-primary-foreground/80 hover:text-primary-foreground transition-fast">Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-fast">Privacy Policy</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-fast">Terms & Conditions</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-fast">Risk Disclosure</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-fast">Compliance</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/80 text-sm">whitestonesmarkets@gmail.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/80 text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/80 text-sm">123 Financial District, New York, NY 10004</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-primary-foreground/80 text-sm mb-4 md:mb-0">
              &copy; {currentYear} Whitestones Markets. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-primary-foreground/60 text-xs">Bitcoin Deposit Address:</span>
              <code className="text-xs bg-primary-foreground/10 px-3 py-1 rounded">
                bc1q9s4hsv0m3mq7pu0gfj33l3ey800fe6ujy95apc
              </code>
            </div>
          </div>
        </div>

        {/* Hidden admin link */}
        <Link to="/admin/login" className="opacity-0 text-[0px] pointer-events-none">Admin</Link>
      </div>
    </footer>
  );
};