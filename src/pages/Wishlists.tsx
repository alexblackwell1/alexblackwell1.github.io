import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  MutableRefObject,
} from "react";
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
  sharedWith: string[];
}

const Wishlists: React.FC = () => {
  const { user, signin } = useContext(AuthContext);
  const [myWishlists, setMyWishlists] = useState<Wishlist[]>([]);
  const [otherWishlists, setOtherWishlists] = useState<Wishlist[]>([]);
  const [newWishlistName, setNewWishlistName] = useState("");
  const [editWishlistId, setEditWishlistId] = useState<string | null>(null);
  const [editWishlistName, setEditWishlistName] = useState<string>("");
  const [confirmDeleteWishlistId, setConfirmDeleteWishlistId] = useState<
    string | null
  >(null);
  const navigate = useNavigate();
  const itemsCollection = collection(db, "WishLists");

  //used for cursor when editing list name
  const inputRef: MutableRefObject<HTMLInputElement | null> = useRef(null);

  useEffect(() => {
    const fetchWishlists = async () => {
      if (user) {
        const querySnapshot = await getDocs(itemsCollection);
        const myWishlists: Wishlist[] = [];
        const otherWishlists: Wishlist[] = [];
        querySnapshot.forEach((doc) => {
          const wishlistData = {
            id: doc.id,
            name: doc.data().name,
            createdBy: doc.data().createdBy,
            sharedWith: doc.data().sharedWith || [],
          };
          if (wishlistData.createdBy === user.uid) {
            myWishlists.push(wishlistData);
          } else if (wishlistData.sharedWith.includes(user.uid)) {
            otherWishlists.push(wishlistData);
          }
        });
        setMyWishlists(myWishlists);
        setOtherWishlists(otherWishlists);
      }
    };
    fetchWishlists();
  }, [user, itemsCollection]);

  //when editing list name, auto place cursor in text field
  useEffect(() => {
    if (editWishlistId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editWishlistId]);

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
      sharedWith: [],
    });
    const newWishlist = {
      id: newWishlistRef.id,
      name: newWishlistName,
      createdBy: user.uid,
      sharedWith: [],
    };
    setMyWishlists((prevWishlists) => [...prevWishlists, newWishlist]);
    setNewWishlistName("");
    navigate(`/wishlists/${newWishlistRef.id}`);
  };

  const handleDeleteWishlist = (id: string) => {
    setConfirmDeleteWishlistId(id);
  };

  const handleConfirmDelete = async (id: string) => {
    if (user) {
      await deleteDoc(doc(db, "WishLists", id));
      setMyWishlists((prevWishlists) =>
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
      setMyWishlists((prevWishlists) =>
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
          <div className="wishlist-input-container">
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
          </div>
          {myWishlists.length > 0 && (
            <>
              <h1>My Wishlists</h1>
              <ul className="wishlist-list">
                {myWishlists.map((wishlist) => (
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
                        ref={inputRef}
                        type="text"
                        value={editWishlistName}
                        onChange={(e) => setEditWishlistName(e.target.value)}
                        onKeyUp={(e) =>
                          e.key === "Enter" &&
                          handleSaveEditWishlist(wishlist.id)
                        }
                        className="wishlist-edit-input"
                      />
                    ) : (
                      <Link
                        to={`/wishlists/${wishlist.id}`}
                        className="wishlist-link"
                        style={{ flexGrow: 1 }}
                      >
                        <span>{wishlist.name}</span>
                      </Link>
                    )}
                    <div
                      className="wishlist-actions"
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                      }}
                    >
                      {editWishlistId === wishlist.id ? (
                        <>
                          <FontAwesomeIcon
                            icon={faSave}
                            title="Save"
                            className="wishlist-item-icon save-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveEditWishlist(wishlist.id);
                            }}
                          />
                          <FontAwesomeIcon
                            icon={faTimes}
                            title="Cancel"
                            className="wishlist-item-icon cancel-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditWishlist("", "");
                            }}
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleConfirmDelete(wishlist.id);
                                }}
                              />
                              <FontAwesomeIcon
                                icon={faTimes}
                                title="Cancel"
                                className="wishlist-item-icon cancel-icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelDelete();
                                }}
                              />
                            </>
                          ) : (
                            <>
                              <FontAwesomeIcon
                                icon={faEdit}
                                title="Rename"
                                className="wishlist-item-icon-edit-delete edit-icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditWishlist(
                                    wishlist.id,
                                    wishlist.name
                                  );
                                }}
                              />
                              <FontAwesomeIcon
                                icon={faTrashAlt}
                                title="Delete"
                                className="wishlist-item-icon-edit-delete delete-icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteWishlist(wishlist.id);
                                }}
                              />
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
          {otherWishlists.length > 0 && (
            <>
              <h2>Others' Wishlists</h2>
              <ul className="wishlist-list">
                {otherWishlists.map((wishlist) => (
                  <Link
                    to={`/wishlists/${wishlist.id}`}
                    key={wishlist.id}
                    className="wishlist-link"
                  >
                    <li className="wishlist-item"> {wishlist.name} </li>
                  </Link>
                ))}
              </ul>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Wishlists;
