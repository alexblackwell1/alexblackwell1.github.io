import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import Header from "../components/Header";
import "./../css/cover.css";
import { AuthContext } from "../context/AuthContext";

interface Wishlist {
  id: string;
  name: string;
}

const Wishlists: React.FC = () => {
  const { user, signin } = useContext(AuthContext);
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [newWishlistName, setNewWishlistName] = useState("");
  const navigate = useNavigate();
  const itemsCollection = collection(db, "WishLists");

  useEffect(() => {
    const fetchWishlists = async () => {
      if (user) {
        const querySnapshot = await getDocs(itemsCollection);
        const wishlists: Wishlist[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setWishlists(wishlists);
      }
    };
    fetchWishlists();
  }, [user, itemsCollection]);

  const handleCreateWishlist = async () => {
    if (user && newWishlistName) {
      await setDoc(doc(db, "WishLists", newWishlistName), {
        name: newWishlistName,
      });
      setNewWishlistName("");
      navigate(0);
    }
  };

  const handleDeleteWishlist = async (id: string) => {
    if (user) {
      await deleteDoc(doc(db, "WishLists", id));
      navigate(0);
    }
  };

  if (!user) {
    return (
      <div className="d-flex h-100 text-center text-white bg-dark">
        <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
          <Header
            title="Wishlists"
            currentPage="/wishlists"
            links={[{ to: "/wishlists", label: "Wishlists" }]}
          />
          <main className="px-3">
            <h1>Wishlists</h1>
            <p>Please sign in to view your wishlists.</p>
            <button onClick={signin}>Sign In</button>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex h-100 text-center text-white bg-dark">
      <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <Header
          title="Wishlists"
          currentPage="/wishlists"
          links={[{ to: "/wishlists", label: "Wishlists" }]}
        />

        <main className="px-3">
          <h1>Wishlists</h1>
          <ul>
            {wishlists.map((wishlist) => (
              <li key={wishlist.id}>
                <Link to={`/wishlists/${wishlist.id}`}>{wishlist.name}</Link>
                <button onClick={() => handleDeleteWishlist(wishlist.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={newWishlistName}
            onChange={(e) => setNewWishlistName(e.target.value)}
            placeholder="Create new wishlist"
          />
          <button onClick={handleCreateWishlist}>Create</button>
        </main>
      </div>
    </div>
  );
};

export default Wishlists;
