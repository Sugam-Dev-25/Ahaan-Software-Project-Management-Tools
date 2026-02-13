const ChatRequest = require("../models/ChatRequest");
const Conversation = require("../models/Conversation");

/* 📤 SEND REQUEST */
exports.sendRequest = async (req, res) => {
  const { userId } = req.body;

  if (userId === req.user.id) {
    return res.status(400).json({ message: "Cannot request yourself" });
  }

  const exists = await ChatRequest.findOne({
    from: req.user.id,
    to: userId,
    status: "pending",
  });

  if (exists) {
    return res.status(400).json({ message: "Request already sent" });
  }

  const request = await ChatRequest.create({
    from: req.user.id,
    to: userId,
  });

  res.status(201).json(request);
};

/* 📥 GET INCOMING REQUESTS */
exports.getIncomingRequests = async (req, res) => {
  const requests = await ChatRequest.find({
    to: req.user.id,
    status: "pending",
  }).populate("from", "name email role");

  res.json(requests);
};

/* ✅ ACCEPT REQUEST */
/* ✅ ACCEPT REQUEST */
exports.acceptRequest = async (req, res) => {
  const request = await ChatRequest.findById(req.params.id);
  if (!request) return res.sendStatus(404);

  // Already accepted হলে আর কিছু করবে না
  if (request.status === "accepted") {
    const existingConversation = await Conversation.findOne({
      members: { $all: [request.from, request.to] },
    }).populate("members", "name email");

    return res.json(existingConversation);
  }

  request.status = "accepted";
  await request.save();

  // 🔥 CHECK if conversation already exists
  let conversation = await Conversation.findOne({
    members: { $all: [request.from, request.to] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      members: [request.from, request.to],
    });
  }

  // populate so frontend gets user names
  await conversation.populate("members", "name email");

  res.json(conversation);
};


/* ❌ REJECT REQUEST */
exports.rejectRequest = async (req, res) => {
  const request = await ChatRequest.findById(req.params.id);
  if (!request) return res.sendStatus(404);

  request.status = "rejected";
  await request.save();

  res.json({ message: "Request rejected" });
};
