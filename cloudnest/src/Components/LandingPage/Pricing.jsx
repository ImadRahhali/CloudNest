import { plans } from "../../constants";
import styles from "../../style";
import PlansCard from "./PlansCard";

const plansCharacteristics = [
  ["10GB Storage","Up to 1GB per file", "Secure Data Encryption","Personalize dashboard", "24/7 Customer Support"],
  ["100GB Storage","Up to 5GB per file", "Advanced Security Features","Personalize dashboard", "Priority Support"],
  ["1TB Storage","Up to 20GB per file", "Enterprise-grade Security","Personalize dashboard", "Account Manager"],
];

const Pricing = () => (
  <section id="plans" className={`${styles.paddingY} ${styles.flexCenter} flex-col relative `}>
    <div className="absolute z-[0] w-[60%] h-[60%] -right-[50%] rounded-full blue__gradient bottom-40" />
    <div className="w-full flex justify-between items-center md:flex-row flex-col sm:mb-16 mb-6 relative z-[1]">
      <h2 className={styles.heading2}>
        What are our <br className="sm:block hidden" />  Plans?
      </h2>
      <div className="w-full md:mt-0 mt-6">
        <p className={`${styles.paragraph} text-left max-w-[450px]`}>
        Discover our flexible pricing plans designed to meet your cloud storage needs.
        </p>
      </div>
    </div>
    <div className="flex flex-wrap sm:justify-start justify-center w-full plan-container relative z-[1] ml-20">
      {plans.map((card, index) => (
        <PlansCard key={card.id} title={card.title} img={card.img} characteristics={plansCharacteristics[index]} />
      ))}
    </div>
  </section>
);

export default Pricing;
