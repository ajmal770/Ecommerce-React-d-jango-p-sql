import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import axios from "axios";

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

const hardcodedProducts = [
  {
    id: 101,
    name: "XH-M564 DC12-24V 2x50W Amplifier Board",
    price: 449,
    old_price: 599,
    img: "https://m.media-amazon.com/images/I/51zTqLMj-ZL.jpg",
    category: "clearance",
  },
  {
    id: 102,
    name: "HR202 Humidity Detection Sensor Module",
    price: 59,
    old_price: 85,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9KO4pmFS14p-vRTfFrkRRIbbBk5ss7JpgIw&s",
    category: "clearance",
  },
  {
    id: 103,
    name: "Bosch Drill Machine Carbon Brush Set (Pair)",
    price: 120,
    old_price: 200,
    img: "https://m.media-amazon.com/images/I/71PGwmmbwuL.jpg",
    category: "clearance",
  },
  {
    id: 104,
    name: "ESP32 WiFi + Bluetooth Development Board",
    price: 599,
    old_price: 799,
    img: "https://images-cdn.ubuy.co.in/63d5968d47cfcb6d7c25c9b2-maxmoral-2pcs-tp4056-lipo-battery.jpg",
    category: "clearance",
  },
  {
    id: 105,
    name: "TP4056 Lipo Battery Charger Module",
    price: 45,
    old_price: 70,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9xwYAU6w7HWuyiq1K7P8h--J64BnuM4Rrig&s",
    category: "clearance",
  },
  {
    id: 106,
    name: "PIR Motion Sensor HC-SR501",
    price: 89,
    old_price: 150,
    img: "https://www.kitkraft.in/cdn/shop/files/pir_3.png?v=1722150549&width=2500",
    category: "clearance",
  },
];

const hardcodedTools = [
  {
    id: 201,
    name: "INGCO Rotary Hammer Drill Machine – RGH6528 – 650W",
    price: 3999,
    img: "https://m.media-amazon.com/images/I/41Ak35jHDLL.jpg",
    category: "tool",
  },
  {
    id: 202,
    name: "INGCO Rotary Hammer Drill Machine – RGH9028 – 800W",
    price: 4999,
    img: "https://m.media-amazon.com/images/I/61ghDHXCfjL.jpg",
    category: "tool",
  },
  {
    id: 203,
    name: "Hoki SDS-39 Power Supply",
    price: 549,
    old_price: 750,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpb4pJSHRrq6NIilXuObMWcAAcaTHCewqsXw&s",
    category: "tool",
  },
  {
    id: 204,
    name: "Digital Multimeter DT830D",
    price: 299,
    old_price: 499,
    img: "https://5.imimg.com/data5/SELLER/Default/2022/12/KM/GH/WJ/21758854/digital-multimeter-dt-830d.jpg",
    category: "tool",
  },
  {
    id: 205,
    name: "Soldering Iron Kit 60W",
    price: 450,
    old_price: 750,
    img: "https://images-cdn.ubuy.qa/6938b6ca7e919b4f6f08812d-60w-adjustable-temperature-soldering.jpg",
    category: "tool",
  },
  {
    id: 206,
    name: "Precision Screwdriver Set 25 in 1",
    price: 350,
    old_price: 600,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShPqYgLS0Pd3CYuwqxUxx6rh18jdyicH7gtQ&s",
    category: "tool",
  },
];

const hardcodedParts = [
  {
    id: 301,
    name: "Carbon Brush Set for Drill Machine",
    price: 199,
    old_price: 299,
    img: "https://m.media-amazon.com/images/I/31XDl9fruAL._AC_UF1000,1000_QL80_.jpg",
    category: "part",
  },
  {
    id: 302,
    name: "Angle Grinder Cutting Disc 4 Inch",
    price: 99,
    old_price: 150,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH6KqFIakbDzhycr4yTNgNaoc9iaGDGDdrGg&s",
    category: "part",
  },
  {
    id: 303,
    name: "Replacement Drill Chuck 13mm",
    price: 450,
    old_price: 650,
    img: "https://atozshop.co.in/wp-content/uploads/2023/08/41ZKSCt5eeL._SX425_-8.jpg",
    category: "part",
  },
  {
    id: 304,
    name: "Switch for 4-inch Angle Grinder",
    price: 150,
    old_price: 250,
    img: "https://m.media-amazon.com/images/I/61ImgH5fgXL.jpg",
    category: "part",
  },
  {
    id: 305,
    name: "Ball Bearing 6201RS",
    price: 45,
    old_price: 80,
    img: "https://i0.wp.com/www.bearinghouse.in/wp-content/uploads/2025/05/NBC-Deep-Groove-Ball-Bearing.png?fit=1500%2C1500&ssl=1",
    category: "part",
  },
  {
  id: 306,
  name: "Electric Drill Rotor",
  price: 550,
  old_price: 800,
  img: "https://m.media-amazon.com/images/I/61kl+444vyL.jpg",
  category: "part",
},
{
  id: 307,
  name: "Circular Saw Blade 7 inch",
  price: 400,
  old_price: 600,
  img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCzm1U-K_pDHd2yUrT4w1Svu2h2IwSY-7w7w&s",
  category: "part",
}

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
  const [products, setProducts] = useState(hardcodedProducts);
  const [tools, setTools] = useState(hardcodedTools);
  const [partsData, setPartsData] = useState(hardcodedParts);
  const [activeSlideUnique, setActiveSlideUnique] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/products/");
        const allProducts = response.data;
        if (allProducts.length > 0) {
          const toolList = allProducts.filter((p) =>
            (p.category || "").toLowerCase().includes("tool"),
          );
          const parts = allProducts.filter((p) =>
            (p.category || "").toLowerCase().includes("part"),
          );
          const clearance = allProducts.filter((p) => {
            const cat = (p.category || "").toLowerCase();
            return cat.includes("clearance") || cat.includes("sale") || (!cat.includes("tool") && !cat.includes("part"));
          });

          setProducts([...clearance, ...hardcodedProducts]);
          setTools([...toolList, ...hardcodedTools]);
          setPartsData([...parts, ...hardcodedParts]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const intervalUnique = setInterval(() => {
      setActiveSlideUnique((prev) =>
        prev === carouselDataUnique.length - 1 ? 0 : prev + 1,
      );
    }, 3000);
    return () => clearInterval(intervalUnique);
  }, []);

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("token");

    // Support guest cart via localStorage
    const cartItem = {
      id: `local-${product.id}`,
      product: product,
      quantity: 1,
    };

    let localCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = localCart.findIndex(
      (item) => item.product.id === product.id,
    );
    if (existingIndex > -1) {
      localCart[existingIndex].quantity += 1;
    } else {
      localCart.push(cartItem);
    }
    localStorage.setItem("cart", JSON.stringify(localCart));
    // Notify Navbar in the same tab to update cart count
    window.dispatchEvent(new Event("cartUpdated"));

    // Support backend cart if logged in
    if (token) {
      try {
        await axios.post(
          "http://127.0.0.1:8000/api/cart/",
          { product_id: product.id, quantity: 1 },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } catch (error) {
        console.error("Backend add failed (likely hardcoded item):", error);
        // We still redirect to cart because local addition succeeded
      }
    }

    navigate("/cart");
  };

  const getImageUrl = (product) => {
    if (product.images && product.images.length > 0)
      return product.images[0].image_url;
    if (product.img) return product.img;
    if (product.image) return product.image;
    if (product.image_url) return product.image_url;
    // Return a clean inline SVG placeholder instead of a dead external URL
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='150' height='150' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23aaa' font-size='13'%3ENo Image%3C/text%3E%3C/svg%3E`;
  };

  return (
    <>
      <Navbar />
      <div className="home">
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

        <div className="clearance">
          <div className="clearance-header">
            <h2>Clearance Sale</h2>
            <a href="/">View all</a>
          </div>
          <div className="product-list">
            {products.map((item, i) => (
              <div className="product-card" key={i}>
                {item.old_price && (
                  <div className="save-tag">
                    Save ₹{item.old_price - item.price}
                  </div>
                )}
                <img src={getImageUrl(item)} alt={item.name} />
                <h4>{item.name}</h4>
                <div className="price">
                  <span className="new">₹{item.price}</span>
                  {item.old_price && (
                    <span className="old">₹{item.old_price}</span>
                  )}
                </div>
                <div className="reviews">
                  ★★★★★ <span>No reviews</span>
                </div>
                <button onClick={() => handleAddToCart(item)}>
                  Add to cart
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="tools-section">
          <h1>Tools</h1>
          <div className="tools-list">
            {tools.map((item, i) => (
              <div className="tool-card" key={i}>
                <img src={getImageUrl(item)} alt={item.name} />
                <h4>{item.name}</h4>
                <div className="tool-price">
                  <span className="new">₹{item.price}</span>
                  {item.old_price && (
                    <span className="old">₹{item.old_price}</span>
                  )}
                </div>
                <button onClick={() => handleAddToCart(item)}>
                  Add To Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="parts-section">
          <h1 className="parts-title">Parts</h1>
          <div className="parts-list">
            {partsData.map((item, i) => (
              <div className="parts-card" key={i}>
                <img src={getImageUrl(item)} alt={item.name} />
                <h4>{item.name}</h4>
                <div className="parts-price">
                  <span className="new">₹{item.price}</span>
                  {item.old_price && (
                    <span className="old">₹{item.old_price}</span>
                  )}
                </div>
                <button
                  className="cart-button"
                  onClick={() => handleAddToCart(item)}
                >
                  Add To Cart
                </button>
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
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Home;
