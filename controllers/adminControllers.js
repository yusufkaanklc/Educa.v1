import Category from "../models/Category.js";
import Course from "../models/Course.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import userControllers from "./userControllers.js";
import slugify from "slugify";

const getAllUsers = async (req, res) => {
  try {
    const { role, username } = req.query;
    // Filtreleme için boş filtre oluşturma
    let filter = {};
    // Eğer role parametresi varsa ve boş değilse filtreye ekle
    if (role && role !== "") {
      filter.role = role;
    }
    // Eğer username parametresi varsa ve boş değilse filtreye eklemek için regex kullan
    if (username && username !== "") {
      const regexPattern = new RegExp(username, "i");
      filter.username = regexPattern;
    }
    // Kullanıcı adı ve rol boş ise tüm kullanıcıları getir
    if (!role && !username) {
      filter = {};
    }
    // Veritabanından kullanıcıları bul
    const users = await User.find(filter);
    // Kullanıcı bulunamadığında hata fırlat
    if (!users || users.length === 0) {
      throw new Error("Kullanıcılar bulunamadı");
    }
    // Kullanıcıları başarıyla bulduğunda 200 OK yanıtı gönder
    res.status(200).json({ users: users });
  } catch (error) {
    // Hata durumunda 500 hatası gönder
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  const { userId } = req.params;
  userControllers.accountDetailsFunc(userId, req, res);
};

const updateUser = (req, res) => {
  const { userId } = req.params;
  userControllers.accountUpdateFunc(userId, req, res);
};

const removeUsers = async (req, res) => {
  try {
    const { userList } = req.body;
    if (!userList || userList.length === 0) {
      throw new Error("No user selected");
    }

    const deletedUserCount = [];

    for (const userId of userList) {
      // Kullanıcıya ait yorumları bulma
      const userComments = await Comment.find({ user: userId });

      // Kullanıcıya ait yorumların yanıtlarını bulma ve silme
      const replyIds = userComments.flatMap((comment) => comment.replies);
      await Comment.deleteMany({ _id: { $in: replyIds } });

      // Kullanıcıya ait yorumları silme
      await Comment.deleteMany({ user: userId });

      for (const userComment of userComments) {
        await Comment.findOneAndUpdate(
          {
            replies: userComment._id,
          },
          { $pull: { replies: userComment?._id } },
          { new: true }
        );

        await Course.findOneAndUpdate(
          { comments: userComment?._id },
          { $pull: { comments: userComment?._id } }
        );
      }

      // Kullanıcıya ait enrollments'ları silme
      await Enrollment.deleteMany({ user: userId });

      // Kullanıcıya ait ownerships'ları silme
      await Ownership.deleteMany({ user: userId });

      // Kullanıcıyı silme
      const deletedUser = await User.findByIdAndDelete(userId);
      if (deletedUser) {
        deletedUserCount.push(userId);
      }
    }

    if (deletedUserCount.length === 0) {
      throw new Error("No users could be deleted");
    }

    req.session.destroy();

    res
      .status(200)
      .json({ message: `${deletedUserCount.length} users deleted` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categoryName = req.query.categoryName;
    let filter = {};

    // Eğer categoryName parametresi varsa ve boş değilse filtreye ekle
    if (categoryName && categoryName.trim() !== "") {
      const regexPattern = new RegExp(categoryName, "i");
      filter.title = regexPattern;
    }

    // Kategori adı parametresi boşsa, tüm kategorileri getirmek için filtre oluşturulmaz
    const categories = await Category.find(filter);

    // Kategoriler bulunamadığında hata fırlat
    if (!categories || categories.length === 0) {
      throw new Error("Kategoriler bulunamadı");
    }

    // Kategorileri başarıyla bulduğunda 200 OK yanıtı gönder
    res.status(200).json(categories);
  } catch (error) {
    // Hata durumunda 500 hatası gönder
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      throw new Error("Fields cannot be empty");
    }
    const newCategory = new Category({
      title,
      description,
    });
    if (!newCategory) {
      throw new Error("Category could not be created");
    }
    await newCategory.save();
    res.status(200).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const category = await Category.findOne({ slug: categorySlug });
    if (!category) {
      throw new Error("Category not found");
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const categorySlug = req.params.categorySlug;
    const { title, description } = req.body;
    if (title === "" || description === "") {
      throw new Error("Fields cannot be empty");
    }

    const newSlug = slugify(title, { lower: true, strict: true });
    const category = await Category.findOneAndUpdate(
      { slug: categorySlug },
      {
        title,
        description,
        slug: newSlug,
      },
      { new: true }
    );
    if (!category) {
      throw new Error("Category could not be updated");
    }
    res.status(200).json({ "updated category :": category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const category = await Category.findOne({ slug: categorySlug });
    const deleteCategory = await Category.findByIdAndDelete(category._id);
    if (!deleteCategory) {
      throw new Error("Category could not be deleted");
    }

    // Kategorisi, silinen kategoriyi referans alan kursların kategorilerini temizle
    const updateResult = await Course.updateMany(
      { category: category._id },
      { $unset: { category: "" } }
    );

    if (updateResult.modifiedCount === 0) {
      throw new Error("No courses found with the given category");
    }

    res.status(200).json({
      message: "Category courses deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getAllUsers,
  getUser,
  updateUser,
  removeUsers,
  getAllCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};
