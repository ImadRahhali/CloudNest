import styles from "../../style";
import Button from "./Button";
import { Link } from "react-router-dom";
const CTA = () => (
  <section className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col bg-black-gradient-2 rounded-[20px] box-shadow`}>
    <div className="flex-1 flex flex-col">
      <h2 className={styles.heading3}>Start your journey with CloudNest Now!</h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        Create Your Account in 2 minutes and start using all our services.
      </p>
    </div>

    <div className={`${styles.flexCenter} sm:ml-10 ml-0 sm:mt-0 mt-10`}>
    <Link to={`/auth`}><Button /></Link>
    </div>
  </section>
);

export default CTA;
