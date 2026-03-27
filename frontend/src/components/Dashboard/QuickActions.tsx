import { Link } from "react-router";

export function QuickActions() {
  return (
    <section className="flex justifyB gap4 alignC color2 ">
     
        <Link to="/" className="hoverEffect">Practice Frontend interview</Link>
        <Link to="/" className="hoverEffect">Practice Backend interview</Link>
        <Link to="/" className="hoverEffect">Practice DSA</Link>
        <Link to="/" className="hoverEffect">View feedback history</Link>
      
    </section>
  );
}
