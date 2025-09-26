// controllers/userController.js

const drivers = {
    "1": {
        id: "1",
        name: "Leanne Graham",
        user_url: "https://oishi-eizo.com/wp-content/uploads/2025/05/1.15.1_1.15.1-e1752915828270-1024x1005.webp",
        carpools: 45,
        thumbsup: 23,
        year: 2024,
        languages: ["English", "Hindi"],
        fun_fact: "I have a blackbelt in Karate",
        weird_trip: "3 people threw up in my car once. 3 people threw up in my car once. 3 people threw up in my car once. ",
        banner_type: "",
        username: "Bret",
        email: "Sincere@april.biz",
        key_location: {
          city: "North Melbourne",
          suburb: "Epping",
        },
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

exports.getAllDriver = async (req, res) => {
  //const driver = await User.find();
  res.json(drivers);
};

exports.getUserById = async (req, res) => {
  const {id} = req.params
  const driver = drivers[id]

  if (!driver) return res.status(404).json({ error: "User not found" });
  res.json(driver);
};

exports.createUser = async (req, res) => {
  res.status(201).json(user);
};

exports.updateUser = async (req, res) => {
  // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  const {id} = req.params
  const { user_url, username, address, languages, fun_fact, weird_trip, key_location, main_campus, phone, description } = req.body
  drivers[id].user_url = user_url
  drivers[id].username = username
  drivers[id].address = address
  drivers[id].languages = languages
  drivers[id].fun_fact = fun_fact
  drivers[id].weird_trip = weird_trip
  drivers[id].key_location = key_location
  drivers[id].main_campus = main_campus
  drivers[id].phone = phone
  drivers[id].description = description

  const driver = drivers[id]
  console.log("POST", driver)

  res.json(driver);
};

exports.deleteUser = async (req, res) => {
  //await User.findByIdAndDelete(req.params.id);
  res.status(204).end();
};
