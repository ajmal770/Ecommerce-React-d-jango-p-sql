import React, { useEffect, useState } from "react";
import "./Home.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const slides = [
  "https://makerbazar.in/cdn/shop/files/WhatsApp_Image_2025-10-24_at_20.38.07.jpg?v=1761471358&width=1600",
  "https://www.tztstore.com/upload/202307/27/202307271729003480.png",
  "https://m.media-amazon.com/images/S/al-eu-726f4d26-7fdb/be830be3-1c47-4bcf-b39c-da372ac52e11._CR0,0,3000,1200_SX1500_.png",
  "https://s.alicdn.com/@sc02/kf/H9dd710c69671410b8a285203e9a9920aD.jpg_750x750q80.jpg",
];

const collections = [
  {
    name: "RC Planes and Drones",
    img: "https://cdn-icons-png.flaticon.com/512/3659/3659899.png",
  },
  {
    name: "Arts & Crafts",
    img: "https://cdn-icons-png.flaticon.com/512/3135/3135755.png",
  },
  {
    name: "3D Printing",
    img: "https://cdn-icons-png.flaticon.com/512/1048/1048953.png",
  },
  {
    name: "Stem Learning Toys",
    img: "https://cdn-icons-png.flaticon.com/512/1995/1995574.png",
  },
  {
    name: "Sensors",
    img: "https://cdn-icons-png.flaticon.com/512/2933/2933245.png",
  },
  {
    name: "Hardware",
    img: "https://cdn-icons-png.flaticon.com/512/2942/2942813.png",
  },
];

const products = [
  {
    name: "Generic: A4 Dye Sublimation Paper 100/120GSM",
    price: "₹22.00",
    tag: "From",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyMC0CuEPTn_sWOhV6Fkl7o1eeEU02dyz5NA&s",
  },
  {
    name: "Silicone Waterproof Shoe Covers Pair",
    price: "₹89.00",
    oldPrice: "₹250.00",
    save: "Save ₹161.00",
    img: "https://images.meesho.com/images/products/562322780/zrfaj_512.webp?width=512",
  },
  {
    name: "XH-M564 DC12-24V 2x50W Amplifier Board",
    price: "₹449.00",
    tag: "From",
    img: "https://m.media-amazon.com/images/I/51zTqLMj-ZL.jpg",
  },

  {
    name: "HR202 Humidity Detection Sensor Module",
    price: "₹59.00",
    oldPrice: "₹85.00",
    save: "Save ₹26.00",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9KO4pmFS14p-vRTfFrkRRIbbBk5ss7JpgIw&s",
  },
  {
    name: "11 Pc Measuring Cup and Spoon Set - Green",
    price: "₹79.00",
    oldPrice: "₹109.00",
    save: "Save ₹30.00",
    img: "https://i5.walmartimages.com/seo/Guozer-Clearance-Measuring-Spoons-Set-of-11-Handle-Measuring-Cup-Eight-Piece-Set-Plastic-Measuring-Cup-Measuring-Spoon-Gray_9e5e8103-7059-4b6b-840e-204f47c8f269.92159a3d0cc83783ffbdbdbfee5275e8.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
  },
  {
    name: "Bosch Drill Machine Carbon Brush Set (Pair)",
    price: "₹120.00",
    oldPrice: "₹200.00",
    save: "Save ₹80.00",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbe6Ikfv9WmSsNO010L9m26lU8CaAife8LUw&s",
  },
  {
    name: "Angle Grinder Spare Armature 850W",
    price: "₹499.00",
    oldPrice: "₹750.00",
    save: "Save ₹251.00",
    img: "https://m.media-amazon.com/images/I/51wdt7jbuWL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    name: "Electric Drill Chuck 13mm Heavy Duty",
    price: "₹299.00",
    oldPrice: "₹450.00",
    save: "Save ₹151.00",
    img: "https://rukminim2.flixcart.com/image/480/640/kshtxu80/drill-bit-set/f/j/g/heavy-duty-13mm-taper-13mm-iron-drill-chuck-with-adapter-dumdaar-original-imag6fq5ghbfw4gg.jpeg?q=90",
  },
  {
    name: "Rotary Hammer Drill Bit Set (5 Pieces)",
    price: "₹349.00",
    oldPrice: "₹600.00",
    save: "Save ₹251.00",
    img: "https://m.media-amazon.com/images/I/81mjOH-qmzL.jpg",
  },
  {
    name: "Power Tool Switch Replacement (Universal)",
    price: "₹89.00",
    oldPrice: "₹150.00",
    save: "Save ₹61.00",
    img: "https://m.media-amazon.com/images/I/718guW7RW-L._AC_UF1000,1000_QL80_.jpg",
  },
];

const tools = [
  {
    name: "INGCO Rotary Hammer Drill Machine – RGH6528 – 650W",
    price: "₹3,999",
    img: "https://m.media-amazon.com/images/I/41Ak35jHDLL.jpg",
    button: "Choose Options",
  },
  {
    name: "INGCO Rotary Hammer Drill Machine – RGH9028 – 800W",
    price: "₹4,999",
    img: "https://m.media-amazon.com/images/I/61ghDHXCfjL.jpg",
    button: "Choose Options",
  },
  {
    name: "Hoki SDS-39 Power Supply For Electric Screwdriver 24/36V",
    price: "₹549",
    oldPrice: "₹750",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpb4pJSHRrq6NIilXuObMWcAAcaTHCewqsXw&s",
    button: "Add To Cart",
  },
  {
    name: "Bosch Professional Angle Grinder – GWS 600",
    price: "₹2,699",
    oldPrice: "₹4,150",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe-3CdlMcLU38WeSWWF3cMtP3uwXDKXCKUhg&s",
    button: "Choose Options",
  },
  {
    name: "INGCO Electric Drill Machine 500W",
    price: "₹1,899",
    img: "https://atozshop.co.in/wp-content/uploads/2023/07/71orkCOZALL._SL1500_.jpg",
    button: "Add To Cart",
  },
  {
    name: "Makita Cordless Drill Driver 12V",
    price: "₹3,299",
    oldPrice: "₹4,500",
    img: "https://m.media-amazon.com/images/I/61zSHPN3ZaL.jpg",
    button: "Add To Cart",
  },
  {
    name: "Black+Decker Heat Gun 2000W",
    price: "₹1,799",
    img: "https://static1.industrybuying.com/products/power-tools/blowers-heat-guns/heat-guns/POW.HEA.723465806_1701063082324.webp",
    button: "Choose Options",
  },
  {
    name: "Stanley Electric Blower 600W",
    price: "₹2,199",
    oldPrice: "₹2,800",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_1KkGA2aih-HflUOsw5DniRjoj166wQZiPA&s",
    button: "Add To Cart",
  },
  {
    name: "DeWalt Impact Drill Machine 650W",
    price: "₹3,499",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9EA2rCziusmdk27v_yp-NsfkloRTEVxntLg&s",
    button: "Choose Options",
  },
  {
    name: "Bosch Electric Planer GHO 10-82",
    price: "₹5,999",
    oldPrice: "₹7,200",
    img: "https://m.media-amazon.com/images/I/71abl22i-HL._AC_UF1000,1000_QL80_.jpg",
    button: "Add To Cart",
  },
];

const partsData = [
  {
    name: "Carbon Brush Set for Drill Machine",
    price: "₹199",
    oldPrice: "₹299",
    img: "https://m.media-amazon.com/images/I/31XDl9fruAL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    name: "Angle Grinder Cutting Disc 4 Inch",
    price: "₹99",
    oldPrice: "₹150",
    img: "https://m.media-amazon.com/images/I/81Q7AbJzBNL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    name: "Drill Chuck 10mm Replacement",
    price: "₹349",
    img: "https://m.media-amazon.com/images/I/41nhqmdNwpS._AC_UF1000,1000_QL80_.jpg",
  },
  {
    name: "Electric Drill Armature Rotor",
    price: "₹699",
    oldPrice: "₹950",
    img: "https://m.media-amazon.com/images/I/51fk6F7Us8L.jpg",
  },
  {
    name: "Power Tool Switch Replacement 16A",
    price: "₹149",
    img: "https://m.media-amazon.com/images/I/51ogyBGzXrL.jpg",
  },
  {
    name: "Cordless Drill Battery 12V",
    price: "₹1,299",
    oldPrice: "₹1,800",
    img: "https://jpttools.com/cdn/shop/files/1_de46cc8c-ec3b-4d19-89c9-b3a1a3197bf2.png?v=1768291448",
  },
  {
    name: "Electric Drill Gear Set",
    price: "₹499",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS56VU4YiYWzN8g260g7d6XkyJVoMb-zZpnqQ&s",
  },
  {
    name: "Angle Grinder Flange Nut Set",
    price: "₹179",
    oldPrice: "₹250",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOCKxle2WCilcR6K9Hkwhw4A-rY9mvDlTWDw&s",
  },
  {
    name: "Heat Gun Heating Element Spare",
    price: "₹399",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKJWJQmYgBseKiA043Z-qXrDS1UP6lUC2flg&s",
  },
  {
    name: "Electric Tool Power Cord 2 Meter",
    price: "₹249",
    oldPrice: "₹350",
    img: "https://m.media-amazon.com/images/I/710Xlc-sLPL._AC_UF1000,1000_QL80_.jpg",
  },
];

const carouselDataUnique = [
  {
    id: 1,
    image:
      "https://cdn.boschtools.com/AP/2021/Campaign%20Hub%20page%20and%20thanks%20for%20registering%20page%20for%20BITURBO%20Campaign/BITurbo_banner_900x380_v1.jpg",
    title: "Power Tools Sale",
    desc: "Best quality tools at low price",
  },
  {
    id: 2,
    image:
      "https://media.licdn.com/dms/image/v2/C4D1BAQHfdgcr70TlIQ/company-background_10000/company-background_10000/0/1643620950982/ingco_official_cover?e=2147483647&v=beta&t=jEYlDV6Kh6XmHwTFduCmKuCnNTf-y1bncuxFmV7-PME",
    title: "New Arrivals",
    desc: "Latest tools collection available",
  },
  {
    id: 3,
    image:
      "https://nationalpowertools.com.au/wp-content/uploads/2019/07/main-banner.jpg",
    title: "Heavy Equipment",
    desc: "Strong and durable machines",
  },
];

function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const [activeSlideUnique, setActiveSlideUnique] = useState(0);

  // Auto slide
  useEffect(() => {
    const intervalUnique = setInterval(() => {
      setActiveSlideUnique((prev) =>
        prev === carouselDataUnique.length - 1 ? 0 : prev + 1,
      );
    }, 3000);

    return () => clearInterval(intervalUnique);
  }, []);

  // Manual controls

  // const nextSlideUnique = () => {
  //   setActiveSlideUnique(
  //     activeSlideUnique === carouselDataUnique.length - 1
  //       ? 0
  //       : activeSlideUnique + 1,
  //   );
  // };

  // const prevSlideUnique = () => {
  //   setActiveSlideUnique(
  //     activeSlideUnique === 0
  //       ? carouselDataUnique.length - 1
  //       : activeSlideUnique - 1,
  //   );
  // };
  return (
    <>
      <Navbar />
      <div className="home">
        {/* CAROUSEL */}
        <div className="carousel">
          <div
            className="carousel-track"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((img, i) => (
              <div className="slide" key={i}>
                <img src={img} alt={`slide-${i}`} />
              </div>
            ))}
          </div>

          <div className="dots">
            {slides.map((_, i) => (
              <span
                key={i}
                className={index === i ? "dot active" : "dot"}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </div>

        {/* COLLECTIONS */}
        <div className="Collections">
          <div className="collection-header">
            <h2>Our collections</h2>
            <a href="/" className="view-all">
              View all
            </a>
          </div>

          <div className="collection-list">
            {collections.map((item, i) => (
              <div className="collection-item" key={i}>
                <div className="circle">
                  <img src={item.img} alt={item.name} />
                </div>
                <p>{item.name}</p>
              </div>
            ))}
          </div>
        </div>
        {/* CLEARANCE SALE */}
        <div className="clearance">
          <div className="clearance-header">
            <h2>Clearance Sale</h2>
            <a href="/">View all</a>
          </div>

          <div className="product-list">
            {products.map((item, i) => (
              <div className="product-card" key={i}>
                {/* Save Tag */}
                {item.save && <div className="save-tag">{item.save}</div>}

                {/* Image */}
                <img src={item.img} alt={item.name} />

                {/* Title */}
                <h4>{item.name}</h4>

                {/* Price */}
                <div className="price">
                  {item.tag && <span className="from">{item.tag} </span>}
                  <span className="new">{item.price}</span>
                  {item.oldPrice && (
                    <span className="old">{item.oldPrice}</span>
                  )}
                </div>

                {/* Reviews */}
                <div className="reviews">
                  ★★★★★ <span>No reviews</span>
                </div>

                {/* Button */}
                <button>Add to cart</button>
              </div>
            ))}
          </div>
        </div>
        {/* TOOLS SECTION */}
        <div className="tools-section">
          <h1>Tools</h1>
          <div className="tools-list">
            {tools.map((item, i) => (
              <div className="tool-card" key={i}>
                {/* Image */}
                <img src={item.img} alt={item.name} />

                {/* Title */}
                <h4>{item.name}</h4>

                {/* Price */}
                <div className="tool-price">
                  <span className="new">{item.price}</span>
                  {item.oldPrice && (
                    <span className="old">{item.oldPrice}</span>
                  )}
                </div>

                {/* Button */}
                <button>{item.button}</button>
              </div>
            ))}
          </div>
        </div>
        {/* Parts section  */}
        <div className="parts-section">
          <h1 className="parts-title">Parts</h1>

          <div className="parts-list">
            {partsData.map((item, i) => (
              <div className="parts-card" key={i}>
                {/* Image */}
                <img src={item.img} alt={item.name} />

                {/* Title */}
                <h4>{item.name}</h4>

                {/* Price */}
                <div className="parts-price">
                  <span className="new">{item.price}</span>
                  {item.oldPrice && (
                    <span className="old">{item.oldPrice}</span>
                  )}
                </div>

                {/* Button */}
                <button className="cart-button">Add To Cart</button>
              </div>
            ))}
          </div>
        </div>

        <div id="mainCarouselWrapperUnique" className="carousel-wrapper-unique">
          <div
            className="carousel-track-unique"
            style={{ transform: `translateX(-${activeSlideUnique * 100}%)` }}
          >
            {carouselDataUnique.map((item) => (
              <div key={item.id} className="carousel-slide-unique">
                <img src={item.image} alt={item.title} />
                <div className="carousel-content-unique">
                  <h2>{item.title}</h2>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          
          {/* <button
            id="prevBtnUnique"
            className="carousel-btn-unique left"
            onClick={prevSlideUnique}
          >
            ◀
          </button>

          <button
            id="nextBtnUnique"
            className="carousel-btn-unique right"
            onClick={nextSlideUnique}
          >
            ▶
          </button> */}
        </div>

        <Footer />
      </div>
    </>
  );
}

export default Home;
