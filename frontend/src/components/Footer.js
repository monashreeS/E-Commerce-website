import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-brand">EduTech Store</div>
        <div>
          © {new Date().getFullYear()} EduTech Store — Best tech for engineering students.
        </div>
      </div>
    </footer>
  );
}