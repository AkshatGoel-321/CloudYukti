import { Linkedin, Github, Twitter } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border text-muted-foreground py-4">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Brand */}
        <div className="text-center md:text-left">
          <Link href="/">
            <h4 className="text-lg font-semibold text-primary">CloudYukti</h4>
          </Link>
          <p className="text-xs text-muted-foreground mt-1">&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
        {/* Quick Links */}
        <div className="flex space-x-6">
          <Link href="/yukti-bot" className="hover:text-primary text-sm transition-colors">
            Yukti-Bot
          </Link>
          <Link href="/gpurecommender" className="hover:text-primary text-sm transition-colors">
            GPU-Recommender
          </Link>
          {/* <Link href="/docs" className="hover:text-primary text-sm">Docs</Link> */}
        </div>
        {/* Social */}
        <div className="flex space-x-6">
          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href="https://github.com/AnshJain9159/CloudYukti"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="https://twitter.com/whoanshjain"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            <Twitter className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  )
}
