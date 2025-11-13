import { Link } from "react-router-dom";

const InvestmentsInfo = () => (
  <div className="container mx-auto px-4 py-20">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Investments</h1>
      <p className="text-muted-foreground mb-4">
        Our investments offering spans listed equities, private placements, structured products and active portfolio management. We aim to match opportunities to investor risk profiles.
      </p>
      <Link to="/company/whitestones-markets" className="text-primary hover:underline">About Whitestones Markets</Link>
    </div>
  </div>
);

export default InvestmentsInfo;
