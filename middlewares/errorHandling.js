const errorHandling = (error, req, res) => {
  let message = `Bir hata oluştu: ${error.message}.`;
  let statusCode = 500; // Varsayılan olarak iç sunucu hatası

  switch (error.code) {
    case 1:
      statusCode = 400;
      break;
    case 2:
      statusCode = 404;
      break;
    case 3:
      statusCode = 401;
      break;
    case 4:
      statusCode = 403;
      break;
    case 5:
      statusCode = 404;
      break;
    case 6:
      statusCode = 500;
      break;
    case 11000:
      message = `${error.keyValue["email" || "title"]} already exists`;
      break;
    // Diğer hata durumlarını buraya ekleyebilirsiniz
    default:
      statusCode = 500;
      break;
  }

  res.status(statusCode).json(message);
};

export default errorHandling;
