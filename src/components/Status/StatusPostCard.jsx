import {
  Avatar,
  Card,
  IconButton,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";
import { red } from "@mui/material/colors";
import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import BookmarkBorderIcon, { BookmarkAdd } from "@mui/icons-material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useDispatch, useSelector } from "react-redux";
import { comment } from "postcss";
import { isLikedByReqUser } from "../../utils/isLikedByReqUser";
import {
  createStatusCommentAction,
  deleteStatusPostAction,
  likeStatusPostAction,
} from "../../Redux/Status/status.action";

const StatusPostCard = ({ item }) => {
  const [showComments, setShowComments] = useState(false);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const { auth } = useSelector((store) => store);

  const loggedInUserId = auth.user.id;
  const checkPostDeletionPermission = item.user.id === loggedInUserId;

  const handleShowComment = () => setShowComments(!showComments);

  const handleCreateComment = (content) => {
    const reqData = {
      postId: item.id,
      data: {
        content: content,
      },
    };
    dispatch(createStatusCommentAction(reqData));
  };

  const handleLikePost = () => {
    dispatch(likeStatusPostAction(item.id));
  };

  const handleDeleteGoalPost = () => {
    dispatch(deleteStatusPostAction(item.id));
    setAnchorEl(null);
  };

  const handleUpdatePost = () => {};

  return (
    <Card className="">
      <CardHeader
        avatar={
          item.user?.proImage === "" ? (
            <Avatar
              sx={{
                height: "3rem",
                width: "3rem",
                fontSize: "1rem",
                bgcolor: red[500],
              }}
            >
              {item.user.firstName[0]}
            </Avatar>
          ) : (
            <Avatar
              sx={{ width: "3rem", height: "3rem" }}
              src={item.user?.proImage}
            ></Avatar>
          )
        }
        action={
          checkPostDeletionPermission && (
            <div>
              <IconButton
                aria-label="settings"
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem onClick={handleDeleteGoalPost}>Delete Post</MenuItem>
                <MenuItem onClick={handleUpdatePost}>Edit Post</MenuItem>
              </Menu>
            </div>
          )
        }
        title={item.user.firstName + " " + item.user.lastName}
        subheader={
          "@" +
          item.user.firstName.toLowerCase() +
          "_" +
          item.user.lastName.toLowerCase()
        }
      />

      <CardContent>
        <Typography
          variant="body3"
          color="text.secondary"
          className="font-bold"
        >
          {item.distanceRun}
        </Typography>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <Card sx={{ backgroundColor: "rgb(183, 42, 42)" }}>
            <CardContent>
              <Typography
                variant="body3"
                color="text.secondary"
                className="font-bold"
              >
                Distance Run
              </Typography>
              <Typography
                variant="body3"
                color="text.secondary"
                className="font-bold"
              >
                {item.distanceRun}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ backgroundColor: "rgb(183, 42, 42)" }}>
            <CardContent>
              <Typography
                variant="body3"
                color="text.secondary"
                className="font-bold"
              >
                Pushups Completed
              </Typography>
              <Typography
                variant="body3"
                color="text.secondary"
                className="font-bold"
              >
                {item.pushupsCompleted}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ backgroundColor: "rgb(183, 42, 42)" }}>
            <CardContent>
              <Typography
                variant="body3"
                color="text.secondary"
                className="font-bold"
              >
                Weight Lifted
              </Typography>
              <Typography
                variant="body3"
                color="text.secondary"
                className="font-bold"
              >
                {item.weightLifted}
              </Typography>
            </CardContent>
          </Card>
        </div>
      </CardContent>

      <CardActions className="flex justify-between" disableSpacing>
        <div>
          <IconButton onClick={handleLikePost}>
            {isLikedByReqUser(auth.user.id, item) ? (
              <FavoriteIcon />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
          <IconButton>{<ShareIcon />}</IconButton>
          <IconButton onClick={handleShowComment}>
            {<ChatBubbleIcon />}
          </IconButton>
        </div>
        <div>
          <IconButton>
            {true ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </IconButton>
        </div>
      </CardActions>
      {showComments && (
        <section>
          <div className="flex items-center mx-3 my-5 space-x-5">
            <Avatar sx={{}} />

            <input
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleCreateComment(e.target.value);
                }
              }}
              className="w-full outline-none bg-transparent border border-[#3b4054] rounded-full px-5 py-2"
              type="text"
              placeholder="Adding comment"
            />
          </div>
          <Divider />

          <div className="mx-3 my-5 space-y-2 text-xs">
            {item.comments?.map((comment) => (
              <div className="flex items-center space-x-5">
                <Avatar
                  sx={{ height: "2rem", width: "2rem", fontSize: ".7rem" }}
                >
                  {comment.user.firstName[0]}
                </Avatar>
                <p>{comment.content}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </Card>
  );
};

export default StatusPostCard;
