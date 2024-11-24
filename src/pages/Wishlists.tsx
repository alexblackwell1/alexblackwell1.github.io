import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import Header from "../components/Header";
import "./../css/cover.css";
import { AuthContext } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faEdit,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

interface Wishlist {
  id: string;
  name: string;
  createdBy: string;
}

const Wishlists: React.FC = () => {
  const { user, signin } = useContext(AuthContext);
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [newWishlistName, setNewWishlistName] = useState("");
  const [editWishlistId, setEditWishlistId] = useState<string | null>(null);
  const [editWishlistName, setEditWishlistName] = useState<string>("");
  const [confirmDeleteWishlistId, setConfirmDeleteWishlistId] = useState<
    string | null
  >(null);
  const navigate = useNavigate();
  const itemsCollection = collection(db, "WishLists");

  useEffect(() => {
    const fetchWishlists = async () => {
      if (user) {
        const querySnapshot = await getDocs(itemsCollection);
        const wishlists: Wishlist[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          createdBy: doc.data().createdBy,
        }));
        setWishlists(wishlists);
      }
    };
    fetchWishlists();
  }, [user, itemsCollection]);

  const handleCreateWishlist = async (
    e: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      (e instanceof KeyboardEvent && e.key !== "Enter") ||
      !user ||
      !newWishlistName
    )
      return;

    // Check if a wishlist with the same name exists for the same user
    const querySnapshot = await getDocs(collection(db, "WishLists"));
    const existingWishlist = querySnapshot.docs.find(
      (doc) =>
        doc.data().name === newWishlistName && doc.data().createdBy === user.uid
    );

    if (existingWishlist) {
      alert(
        "You already have a wishlist with this name. Please choose a unique name."
      );
      return;
    }

    // Create new wishlist
    const newWishlistRef = doc(collection(db, "WishLists"));
    await setDoc(newWishlistRef, {
      name: newWishlistName,
      createdBy: user.uid,
    });
    const newWishlist = {
      id: newWishlistRef.id,
      name: newWishlistName,
      createdBy: user.uid,
    };
    setWishlists((prevWishlists) => [...prevWishlists, newWishlist]);
    setNewWishlistName("");
    navigate(`/wishlists/${newWishlistRef.id}`);
  };

  const handleDeleteWishlist = (id: string) => {
    setConfirmDeleteWishlistId(id);
  };

  const handleConfirmDelete = async (id: string) => {
    if (user) {
      await deleteDoc(doc(db, "WishLists", id));
      setWishlists((prevWishlists) =>
        prevWishlists.filter((wishlist) => wishlist.id !== id)
      );
      setConfirmDeleteWishlistId(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteWishlistId(null);
  };

  const handleEditWishlist = (id: string, name: string) => {
    setEditWishlistId(id);
    setEditWishlistName(name);
  };

  const handleSaveEditWishlist = async (id: string) => {
    if (user && editWishlistName) {
      // Check if a wishlist with the same name exists for the same user
      const querySnapshot = await getDocs(collection(db, "WishLists"));
      const existingWishlist = querySnapshot.docs.find(
        (doc) =>
          doc.data().name === editWishlistName &&
          doc.data().createdBy === user.uid &&
          doc.id !== id
      );

      if (existingWishlist) {
        alert(
          "You already have a wishlist with this name. Please choose a unique name."
        );
        return;
      }

      // Update wishlist
      const wishlistRef = doc(db, "WishLists", id);
      await updateDoc(wishlistRef, { name: editWishlistName });
      setWishlists((prevWishlists) =>
        prevWishlists.map((wishlist) =>
          wishlist.id === id
            ? { ...wishlist, name: editWishlistName }
            : wishlist
        )
      );
      setEditWishlistId(null);
      setEditWishlistName("");
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
          <ul className="wishlist-list">
            {wishlists.map((wishlist) => (
              <li
                key={wishlist.id}
                className={
                  editWishlistId === wishlist.id
                    ? "wishlist-item-edit"
                    : "wishlist-item"
                }
              >
                {editWishlistId === wishlist.id ? (
                  <input
                    type="text"
                    value={editWishlistName}
                    onChange={(e) => setEditWishlistName(e.target.value)}
                    onKeyUp={(e) =>
                      e.key === "Enter" && handleSaveEditWishlist(wishlist.id)
                    }
                    className="wishlist-edit-input"
                  />
                ) : (
                  <Link
                    to={`/wishlists/${wishlist.id}`}
                    className="wishlist-link"
                  >
                    {wishlist.name}
                  </Link>
                )}
                <div className="wishlist-actions">
                  {editWishlistId === wishlist.id ? (
                    <>
                      <FontAwesomeIcon
                        icon={faSave}
                        title="Save"
                        className="wishlist-item-icon save-icon"
                        onClick={() => handleSaveEditWishlist(wishlist.id)}
                      />
                      <FontAwesomeIcon
                        icon={faTimes}
                        title="Cancel"
                        className="wishlist-item-icon cancel-icon"
                        onClick={() => handleEditWishlist("", "")}
                      />
                    </>
                  ) : (
                    <>
                      {confirmDeleteWishlistId === wishlist.id ? (
                        <>
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            title="Confirm"
                            className="wishlist-item-icon check-icon"
                            onClick={() => handleConfirmDelete(wishlist.id)}
                          />
                          <FontAwesomeIcon
                            icon={faTimes}
                            title="Cancel"
                            className="wishlist-item-icon cancel-icon"
                            onClick={handleCancelDelete}
                          />
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon
                            icon={faEdit}
                            title="Rename"
                            className="wishlist-item-icon-edit-delete edit-icon"
                            onClick={() =>
                              handleEditWishlist(wishlist.id, wishlist.name)
                            }
                          />
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            title="Delete"
                            className="wishlist-item-icon-edit-delete delete-icon"
                            onClick={() => handleDeleteWishlist(wishlist.id)}
                          />
                        </>
                      )}
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={newWishlistName}
            onChange={(e) => setNewWishlistName(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && handleCreateWishlist(e)}
            placeholder="Create new wishlist"
            className="wishlist-input"
          />
          <button onClick={handleCreateWishlist} className="wishlist-button">
            Create
          </button>
        </main>
      </div>
    </div>
  );
};

export default Wishlists;
