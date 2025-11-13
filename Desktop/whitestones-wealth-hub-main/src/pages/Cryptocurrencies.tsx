import { Link } from "react-router-dom";

const Cryptocurrencies = () => {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">What is Bitcoin?</h1>
        <p className="mb-6 text-muted-foreground">
          A short explainer video about Bitcoin. Watch the video below to learn the basics — what Bitcoin is, how it works, and common use cases.
        </p>

        <div className="aspect-w-16 aspect-h-9">
          <iframe
            src="https://www.youtube.com/embed/Gc2en3nHxA4"
            title="What is Bitcoin?"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded"
          />
        </div>

        <div className="mt-6">
          <Link to="/" className="text-primary hover:underline">Return to home</Link>
        </div>
      </div>
    </div>
  );
};

export default Cryptocurrencies;
