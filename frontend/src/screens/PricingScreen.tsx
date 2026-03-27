import React, { useState } from "react";
import "../styles/pricingScreen.css"
import { Header } from "../components/Header";
import { Check, Cross, X } from "lucide-react";
import { Button } from "../components/Button";

export const PricingPage: React.FC = () => {

  return (
    <div className="bg1 flexC">
      <Header />
      <div className="container flexC gap4 padY5">
        <PricingHero />
        <PricingCards />
        <FeatureComparison />
        <PricingFAQ />
      </div>
    </div>
  );
};

const PricingHero: React.FC = () => {
  return (
    <div className="pricing-hero flexC alignC gap2">
      <h1 className="fXL">Practice with precision. Perform with clarity.</h1>
      <p className="fS color2">
        Start free. Upgrade when you're serious about cracking interviews.
      </p>
    </div>
  );
};

const PricingCards: React.FC = () => {
  return (
    <div className="flex gap5 justifyC flexWrap">
      <PricingCard
        type="free"
        title="Free"
        subTitle="Starter"
        price="₹0"
        description="Get started with basic interview prep"
        features={[
          "3 interviews per month",
          "Theory questions only",
          "Basic AI evaluation",
          "Limited transcript storage",
        ]}
        cta="Start Free"
      />

      <PricingCard
        type="pro"
        title="Pro"
        subTitle="Most Popular"
        price="₹499"
        description="Perfect for serious interview preparation"
        highlight
        features={[
          "25 interviews per month",
          "Theory + Coding",
          "Full AI evaluation",
          "Gap analysis",
          "Question-level breakdown",
          "Adaptive follow-ups",
          "Interview history",
          "Priority processing",
        ]}
        cta="Upgrade to Pro"
      />

      <PricingCard
        type="elite"
        title="Elite"
        subTitle="Lets Go !"
        price="₹999"
        description="Maximum preparation with advanced features"
        features={[
          "Unlimited interviews",
          "Advanced AI analysis",
          "CV-based interview generation",
          "Detailed performance trends",
          "Mock HR rounds",
          "Early feature access",
        ]}
        cta="Go Elite"
      />
    </div>
  );
};

interface PricingCardProps {
  title: string;
  price: string;
  subTitle: string;
  description: string;
  features: string[];
  cta: string;
  type: "free" | "pro" | "elite";
  highlight?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  subTitle,
  price,
  description,
  features,
  cta,
  highlight,
}) => {
  function handleCta(){

  }
  return (
    <div className={`pricing-card pad5 bR6 border ${highlight ? "pricing-card-highlight" : ""}`}>
      {highlight && <div className="pricing-badge">Most Popular</div>}

      <div>
        <h3 className="pricing-plan-title">{title}</h3>
        <div className="color2 fS">{subTitle}</div>
      </div>
      <div className="pricing-price padY2">
        {price}
        {price !== "₹0" && <span className="pricing-duration"> / month</span>}
        <p className="pricing-desc color2">{description}</p>
      </div>

      
      <div className="padY3">
        <Button text={cta} className={`fullWidth ${highlight? "pricing-btn-primary":"btn3"}`} paddingX={16} paddingY={8} onClickFn={handleCta} disabled={false}/>
      </div>

      <ul className="pricing-feature-list flexC gap2">
        {features.map((feature, index) => (
          <li key={index} className="gap2 flex fS">
            <span className="color6"><Check size={20}/></span> {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

const FeatureComparison: React.FC = () => {
  return (
    <div className="pricing-table-container padY5">
      <h2 className="pricing-section-title">Feature Comparison</h2>

      <table className="pricing-table">
        <thead>
          <tr>
            <th>Feature</th>
            <th>Free</th>
            <th>Pro</th>
            <th>Elite</th>
          </tr>
        </thead>
        <tbody>
          <ComparisonRow feature="Theory Interviews" free pro elite />
          <ComparisonRow feature="Coding Evaluation" pro elite />
          <ComparisonRow feature="Gap Analysis" pro elite />
          <ComparisonRow feature="CV-Based Interview" elite />
          <ComparisonRow feature="Performance Trends" elite />
          <ComparisonRow feature="Mock HR Rounds" elite />
        </tbody>
      </table>
    </div>
  );
};

interface RowProps {
  feature: string;
  free?: boolean;
  pro?: boolean;
  elite?: boolean;
}

const ComparisonRow: React.FC<RowProps> = ({ feature, free, pro, elite }) => {
  return (
    <tr>
      <td>{feature}</td>
      <td>{free ? <Check size={20} color="#34d399"/> : <X size={20} color="#898989"/>}</td>
      <td className="bg2">{pro ? <Check size={20} color="#34d399"/> : <X size={20} color="#898989"/>}</td>
      <td>{elite ? <Check size={20} color="#34d399"/> : <X size={20} color="#898989"/>}</td>
    </tr>
  );
};

const PricingFAQ: React.FC = () => {
  return (
    <div className="padY5">
      <h2 className="fL padYB3">Frequently Asked Questions</h2>

      <FAQItem
        question="Is there a free trial?"
        answer="Yes. You can use the Free plan with limited interviews each month."
      />
      <FAQItem
        question="Can I cancel anytime?"
        answer="Absolutely. You can cancel your subscription anytime from account settings."
      />
      <FAQItem
        question="Do you offer refunds?"
        answer="Refunds are handled on a case-by-case basis."
      />
      <FAQItem
        question="Is coding evaluation real-time?"
        answer="Yes. Code is executed and evaluated instantly using AI-based analysis."
      />
    </div>
  );
};

const FAQItem: React.FC<{ question: string; answer: string }> = ({
  question,
  answer,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="faq-item borderB2">
      <div className="faq-question" onClick={() => setOpen(!open)}>
        {question}
      </div>
      {open && <div className="faq-answer">{answer}</div>}
    </div>
  );
};
