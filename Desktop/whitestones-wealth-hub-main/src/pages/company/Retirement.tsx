import { Link } from "react-router-dom";

const Retirement = () => (
  <div className="container mx-auto px-4 py-20">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Retirement</h1>
      <p className="text-muted-foreground mb-4">
        Our retirement planning solutions combine diversified investments with tax-aware strategies to help clients reach their long-term goals.
      </p>
      <Link to="/company/investments" className="text-primary hover:underline">Related investments</Link>
    </div>
  </div>
);

export default Retirement;
