import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Camera, X } from "lucide-react";
import api from "../store/api";
import {
  getAllSplashScreens,
  getSplashStats,
  createSplashScreen,
  updateSplashScreen,
  deleteSplashScreen,
  toggleSplashStatus,
  bulkUpdateSplashStatus,
  clearNotifications,
  selectAllSplashScreens,
  selectSplashStats,
  selectSplashLoading,
  selectSplashError,
  selectSplashMessage,
  selectCreateLoading,
  selectUpdateLoading,
  selectDeleteLoading,
} from "../store/slices/splashSlice";
import Sidebar from "../components/ui/Sidebar";
import { selectUser } from "../store/slices/userSlice"; // Add this import
import { useNavigate } from "react-router-dom";

export default function SplashAdminPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector(selectUser);

  const splashScreens = useSelector(selectAllSplashScreens);
  const stats = useSelector(selectSplashStats);
  const loading = useSelector(selectSplashLoading);
  const error = useSelector(selectSplashError);
  const message = useSelector(selectSplashMessage);
  const createLoading = useSelector(selectCreateLoading);
  const updateLoading = useSelector(selectUpdateLoading);
  const deleteLoading = useSelector(selectDeleteLoading);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedSplash, setSelectedSplash] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeSection, setActiveSection] = useState("splash");

  const userData = {
    firstName: currentUser?.firstName || currentUser?.first_name || "Admin",
    lastName: currentUser?.lastName || currentUser?.last_name || "User",
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    buttonText: "",
    buttonLink: "",
    backgroundColor: "#ffffff",
    textColor: "#000000",
    displayOrder: 0,
    isActive: true,
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    dispatch(getAllSplashScreens());
    dispatch(getSplashStats());
  }, [dispatch]);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        dispatch(clearNotifications());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error, dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    setUploadingImage(true);
    const formDataImage = new FormData();
    formDataImage.append("image", imageFile);

    try {
      // Adjust this endpoint to match your backend upload endpoint
      const response = await api.post("/upload/image", formDataImage, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.imageUrl || response.data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleOpenModal = (mode, splash = null) => {
    setModalMode(mode);
    setSelectedSplash(splash);
    setImageFile(null);
    setImagePreview(null);

    if (mode === "edit" && splash) {
      setFormData({
        title: splash.title || "",
        description: splash.description || "",
        imageUrl: splash.image_url || "",
        buttonText: splash.button_text || "",
        buttonLink: splash.button_link || "",
        backgroundColor: splash.background_color || "#ffffff",
        textColor: splash.text_color || "#000000",
        displayOrder: splash.display_order || 0,
        isActive: splash.is_active || false,
        startDate: splash.start_date ? splash.start_date.split("T")[0] : "",
        endDate: splash.end_date ? splash.end_date.split("T")[0] : "",
      });
      if (splash.image_url) {
        setImagePreview(splash.image_url);
      }
    } else {
      setFormData({
        title: "",
        description: "",
        imageUrl: "",
        buttonText: "",
        buttonLink: "",
        backgroundColor: "#ffffff",
        textColor: "#000000",
        displayOrder: 0,
        isActive: true,
        startDate: "",
        endDate: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSplash(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    if (!formData.title) {
      alert("Title is required");
      return;
    }

    try {
      let imageUrl = formData.imageUrl;

      // Upload image if a new file was selected
      if (imageFile) {
        imageUrl = await uploadImage();
        if (!imageUrl) return; // Upload failed
      }

      const submitData = {
        ...formData,
        imageUrl,
      };

      if (modalMode === "create") {
        await dispatch(createSplashScreen(submitData)).unwrap();
      } else {
        await dispatch(
          updateSplashScreen({ id: selectedSplash.id, updateData: submitData })
        ).unwrap();
      }
      handleCloseModal();
      dispatch(getAllSplashScreens());
      dispatch(getSplashStats());
    } catch (err) {
      console.error("Error submitting:", err);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await dispatch(deleteSplashScreen(deleteId)).unwrap();
        setShowDeleteConfirm(false);
        setDeleteId(null);
        dispatch(getAllSplashScreens());
        dispatch(getSplashStats());
      } catch (err) {
        console.error("Error deleting:", err);
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await dispatch(toggleSplashStatus(id)).unwrap();
      dispatch(getAllSplashScreens());
      dispatch(getSplashStats());
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(splashScreens.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkActivate = async () => {
    if (selectedIds.length > 0) {
      try {
        await dispatch(
          bulkUpdateSplashStatus({ ids: selectedIds, isActive: true })
        ).unwrap();
        setSelectedIds([]);
        dispatch(getAllSplashScreens());
        dispatch(getSplashStats());
      } catch (err) {
        console.error("Error bulk activating:", err);
      }
    }
  };

  const handleBulkDeactivate = async () => {
    if (selectedIds.length > 0) {
      try {
        await dispatch(
          bulkUpdateSplashStatus({ ids: selectedIds, isActive: false })
        ).unwrap();
        setSelectedIds([]);
        dispatch(getAllSplashScreens());
        dispatch(getSplashStats());
      } catch (err) {
        console.error("Error bulk deactivating:", err);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        userType="admin"
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        userData={userData}
      />

      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Splash Screen Management
            </h1>
            <button
              onClick={() => handleOpenModal("create")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + Create New
            </button>
          </div>

          {(message || error) && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                error
                  ? "bg-red-100 text-red-700 border border-red-300"
                  : "bg-green-100 text-green-700 border border-green-300"
              }`}
            >
              {error || message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-gray-500 text-sm mb-1">Total</div>
              <div className="text-3xl font-bold text-gray-800">
                {stats.total}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-gray-500 text-sm mb-1">Active</div>
              <div className="text-3xl font-bold text-green-600">
                {stats.active}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-gray-500 text-sm mb-1">Inactive</div>
              <div className="text-3xl font-bold text-red-600">
                {stats.inactive}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-gray-500 text-sm mb-1">Scheduled</div>
              <div className="text-3xl font-bold text-blue-600">
                {stats.scheduled}
              </div>
            </div>
          </div>

          {selectedIds.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg mb-4 flex items-center justify-between">
              <span className="text-blue-700 font-medium">
                {selectedIds.length} items selected
              </span>
              <div className="space-x-2">
                <button
                  onClick={handleBulkActivate}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Activate All
                </button>
                <button
                  onClick={handleBulkDeactivate}
                  className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
                >
                  Deactivate All
                </button>
                <button
                  onClick={() => setSelectedIds([])}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-500">Loading...</div>
            ) : splashScreens.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No splash screens found. Create your first one!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={
                            selectedIds.length === splashScreens.length &&
                            splashScreens.length > 0
                          }
                          onChange={handleSelectAll}
                          className="w-4 h-4"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Schedule
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {splashScreens.map((splash) => (
                      <tr key={splash.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(splash.id)}
                            onChange={() => handleSelectOne(splash.id)}
                            className="w-4 h-4"
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {splash.display_order}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            {splash.image_url && (
                              <img
                                src={splash.image_url}
                                alt={splash.title}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div>
                              <div className="font-medium text-gray-800">
                                {splash.title}
                              </div>
                              {splash.description && (
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {splash.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleStatus(splash.id)}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              splash.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {splash.is_active ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {splash.start_date || splash.end_date ? (
                            <div>
                              {splash.start_date && (
                                <div>
                                  From:{" "}
                                  {new Date(
                                    splash.start_date
                                  ).toLocaleDateString()}
                                </div>
                              )}
                              {splash.end_date && (
                                <div>
                                  To:{" "}
                                  {new Date(
                                    splash.end_date
                                  ).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          ) : (
                            "No schedule"
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleOpenModal("edit", splash)}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setDeleteId(splash.id);
                                setShowDeleteConfirm(true);
                              }}
                              className="text-red-600 hover:text-red-800 font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-800">
                  {modalMode === "create" ? "Create" : "Edit"} Splash Screen
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Splash Image
                  </label>

                  {!imagePreview ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <Camera className="w-12 h-12 text-gray-400 mb-3" />
                        <span className="text-sm text-gray-600 mb-1">
                          Click to upload image
                        </span>
                        <span className="text-xs text-gray-400">
                          PNG, JPG, GIF up to 5MB
                        </span>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="mt-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                          id="image-replace"
                        />
                        <label
                          htmlFor="image-replace"
                          className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
                        >
                          Change image
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Button Text
                    </label>
                    <input
                      type="text"
                      name="buttonText"
                      value={formData.buttonText}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Button Link
                    </label>
                    <input
                      type="text"
                      name="buttonLink"
                      value={formData.buttonLink}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Background Color
                    </label>
                    <input
                      type="color"
                      name="backgroundColor"
                      value={formData.backgroundColor}
                      onChange={handleInputChange}
                      className="w-full h-10 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Text Color
                    </label>
                    <input
                      type="color"
                      name="textColor"
                      value={formData.textColor}
                      onChange={handleInputChange}
                      className="w-full h-10 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">
                    Active
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={createLoading || updateLoading || uploadingImage}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {uploadingImage
                      ? "Uploading..."
                      : createLoading || updateLoading
                      ? "Saving..."
                      : modalMode === "create"
                      ? "Create"
                      : "Update"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Confirm Delete
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this splash screen? This action
                cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteId(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
