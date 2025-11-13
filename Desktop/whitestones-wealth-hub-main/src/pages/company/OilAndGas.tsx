import { Link } from "react-router-dom";

const OilAndGas = () => (
  <div className="container mx-auto px-4 py-20">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Oil & Gas</h1>
      <p className="text-muted-foreground mb-4">
        Commodity and energy investments are offered selectively to clients seeking exposure to oil, gas and related infrastructure assets.
      </p>
      <Link to="/company/whitestones-markets" className="text-primary hover:underline">About Whitestones Markets</Link>
    </div>
  </div>
);

export default OilAndGas;
