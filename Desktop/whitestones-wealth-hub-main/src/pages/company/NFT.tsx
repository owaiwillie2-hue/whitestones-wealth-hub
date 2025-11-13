import { Link } from "react-router-dom";

const NFT = () => (
  <div className="container mx-auto px-4 py-20">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">NFTs</h1>
      <p className="text-muted-foreground mb-4">
        Non-fungible tokens represent unique digital assets. We work with creators and collectors to offer curated opportunities in the NFT space.
      </p>
      <Link to="/company/cryptocurrencies" className="text-primary hover:underline">Cryptocurrency services</Link>
    </div>
  </div>
);

export default NFT;
