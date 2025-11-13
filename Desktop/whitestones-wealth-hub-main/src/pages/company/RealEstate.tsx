import { Link } from "react-router-dom";

const RealEstate = () => (
  <div className="container mx-auto px-4 py-20">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Real Estate</h1>
      <p className="text-muted-foreground mb-4">
        We source institutional-grade real estate opportunities to provide investors with income and appreciation potential backed by professional asset management.
      </p>
      <Link to="/company/whitestones-markets" className="text-primary hover:underline">About Whitestones Markets</Link>
    </div>
  </div>
);

export default RealEstate;
