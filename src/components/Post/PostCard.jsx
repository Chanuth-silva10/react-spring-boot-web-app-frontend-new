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
import BookmarkBorderIcon from "@mui/icons-material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useDispatch, useSelector } from "react-redux";
import {
  createCommentAction,
  deletePostAction,
  likePostAction,
} from "../../Redux/Post/post.action";
import { comment } from "postcss";
import { isLikedByReqUser } from "../../utils/isLikedByReqUser";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

const PostCard = ({ item }) => {
  const [showComments, setShowComments] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
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
    dispatch(createCommentAction(reqData));
  };

  const handleLikePost = () => {
    dispatch(likePostAction(item.id));
  };

  const handleDeletePost = () => {
    dispatch(deletePostAction(item.id));
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
                <MenuItem onClick={handleDeletePost}>Delete Post</MenuItem>
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

      {item.image === null || item.image === "" ? (
        <video controls className="w-full h-full" src={item.video}></video>
      ) : (
        <img
          className="w-full max-h-[30rem] object-cover object-top"
          src={item.image}
          alt=""
        />
      )}

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {item.caption}
        </Typography>
      </CardContent>
      <CardActions className="flex justify-between" disableSpacing>
        <div>
          <IconButton onClick={handleLikePost}>
            {isLikedByReqUser(auth.user.id, item) ? (
              <ThumbUpAltIcon style={{ color: '#20cbc8' }}/>
            ) : (
              <ThumbUpOffAltIcon />
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
                {comment.user?.proImage === "" ? (
                  <Avatar
                    sx={{ height: "2rem", width: "2rem", fontSize: ".7rem" }}
                  >
                    {comment.user.firstName[0]}
                  </Avatar>
                ) : (
                  <Avatar
                    sx={{ width: "2rem", height: "2rem" }}
                    src={comment.user?.proImage}
                  ></Avatar>
                )}

                <p>{comment.content}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </Card>
  );
};

export default PostCard;
