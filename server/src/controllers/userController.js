const User = require("../models/User");

const users = {
    "1": {
        id: "1",
        name: "Leanne Graham",
        user_url: "https://oishi-eizo.com/wp-content/uploads/2025/05/1.15.1_1.15.1-e1752915828270-1024x1005.webp",
        trips_count: 105,
        banner_type: "",
        username: "Bret",
        email: "Sincere@april.biz",
        address: {
          street: "main streen",
          no: "116",
          city: "Melbourne",
          zipcode: "3076",
        },
        main_campus: "Clayton",
        phone: "1-770-736-8031",
        description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cupiditate soluta ipsum aperiam ab, culpa illum totam minus laudantium illo. Fugiat quas repudiandae debitis magni, sint provident a necessitatibus magnam quae doloribus architecto, aut nesciunt aliquid nemo ducimus, amet ut adipisci laudantium dignissimos consequuntur voluptatum inventore ipsam blanditiis. Consequatur at nemo obcaecati consequuntur! Quo qui corporis atque eos beatae, maiores distinctio, doloribus alias est officia repudiandae dolore amet debitis nesciunt? Veritatis consequuntur odio omnis repellat! Qui, voluptas! Tempora, fugiat ex optio doloribus quaerat cupiditate tenetur fugit pariatur facere incidunt sed quae odio consequatur ad laborum atque suscipit molestiae. Qui, nam saepe!"
    }
}

exports.getAllUsers = async (req, res) => {
  //const users = await User.find();
  const users = [{
        id: "1",
        name: "Leanne Graham",
        user_url: "https://oishi-eizo.com/wp-content/uploads/2025/05/1.15.1_1.15.1-e1752915828270-1024x1005.webp",
        trips_count: 105,
        banner_type: "",
        username: "Bret",
        email: "Sincere@april.biz",
        address: {
          street: "main streen",
          no: "116",
          city: "Melbourne",
          zipcode: "3076",
        },
        main_campus: "Clayton",
        phone: "1-770-736-8031",
        description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cupiditate soluta ipsum aperiam ab, culpa illum totam minus laudantium illo. Fugiat quas repudiandae debitis magni, sint provident a necessitatibus magnam quae doloribus architecto, aut nesciunt aliquid nemo ducimus, amet ut adipisci laudantium dignissimos consequuntur voluptatum inventore ipsam blanditiis. Consequatur at nemo obcaecati consequuntur! Quo qui corporis atque eos beatae, maiores distinctio, doloribus alias est officia repudiandae dolore amet debitis nesciunt? Veritatis consequuntur odio omnis repellat! Qui, voluptas! Tempora, fugiat ex optio doloribus quaerat cupiditate tenetur fugit pariatur facere incidunt sed quae odio consequatur ad laborum atque suscipit molestiae. Qui, nam saepe!"
      }]
  res.json(users);
};

exports.getUserById = async (req, res) => {
  const {id} = req.params
  const user = users[id]
  console.log("dasdas")
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
};

exports.createUser = async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).json(user);
};

exports.updateUser = async (req, res) => {
  // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  const {id} = req.params
  const { user_url, username, address, main_campus, phone, description } = req.body
  users[id].user_url = user_url
  users[id].username = username
  users[id].address = address
  users[id].main_campus = main_campus
  users[id].phone = phone
  users[id].description = description

  const user = users[id]

  res.json(user);
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(204).end();
};
