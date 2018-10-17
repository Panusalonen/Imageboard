(function() {
    Vue.component("image-modal", {
        props: ["currentImage"],
        data: function() {
            return {
                info: [],
                comments: [],
                form: {
                    comment: "",
                    username: ""
                }
            };
        },
        template: "#tmpl",
        mounted: function() {
            // console.log("checking: ", this.currentImage);

            var app = this;
            axios.get("/images/" + this.currentImage).then(res => {
                // console.log("jhdsfjkhasdf", res.data);

                if(res.data.imgInfo.length == 0){
                    // console.log("res.data: ", res.data);
                    app.closeModal();
                } else {
                    app.info = res.data.imgInfo[0];
                    app.comments = res.data.comments.concat(res.data);
                }
            });
        },
        methods: {
            closeModal: function() {
                this.$emit("close");
            },
            addComments: function(event) {
                event.preventDefault();
                var app = this;
                var commentInfo = {
                    user_id: this.currentImage,
                    comment: this.form.comment,
                    username: this.form.username
                };
                // console.log("info: ", commentInfo);
                // console.log("CurrentImage: ", this.currentImage);
                axios.post("/images/" + this.currentImage, commentInfo).then(res => {
                    // console.log("resp in POST /upload: ", res.data.comments);
                    app.comments.unshift(res.data[0]);
                    this.form.comment = "";
                    this.form.username = "";
                    // console.log("Our comments", app.comments);
                });
            }
        },
        watch: {
            currentImage: function(){
                var app = this;
                axios.get("/images/" + this.currentImage).then(res => {
                    if(res.data.imgInfo.length == 0){
                        app.closeModal();
                    } else {
                        app.info = res.data[0];
                        app.comments = app.comments.concat(res.data);
                    }
                });
            }
        }
    });

    var app = new Vue({
        el: "#main",
        data: {
            images: [],
            show: true,
            noMorePics: false,
            currentImage: location.hash.length > 1 && location.hash.slice(1),
            form: {
                title: "",
                description: "",
                username: ""
            }
        },
        mounted: function() {

            addEventListener('hashchange', function(){
                app.currentImage = location.hash.slice(1);
            })
            axios.get("/images").then(function(res) {
                // console.log("res.data: ", res.data);
                app.images = res.data;
            });
        },
        methods: {
            uploadFile: function(e) {
                var app = this;
                e.preventDefault();
                var file = $('input[type="file"]').get(0).files[0];
                // console.log("file uploaded: ", file);

                var formData = new FormData();

                formData.append("file", file);
                formData.append("title", this.form.title);
                formData.append("description", this.form.description);
                formData.append("username", this.form.username);

                axios.post("/upload", formData).then(function(res) {
                    // console.log("resp in POST /upload: ", res.data);

                    app.images.unshift(res.data.image);
                    app.form.title = "";
                    app.form.description = "";
                    app.form.username = "";
                    file = "";
                });
            }, // close upload file
            setCurrentImage: function(id) {
                this.currentImage = id;
                // console.log("checking again: ", this.currentImage);
            },
            nullifyCurrentImage: function() {
                var q = pageYOffset;
                this.currentImage = null;
                location.hash = "";
                window.scrollTo(0, q);
            },
            loadMore: function(){
                if(this.noMorePics){
                    return
                }
                var app = this;
                var idOfLastImg = this.images[this.images.length - 1].id;

                axios.get("/getMoreImages/" + idOfLastImg)
                    .then(res => {
                        if(res.data.length < 10){
                            app.noMorePics = true;
                        }
                    // console.log("res: ", res);
                    app.images = app.images.concat(res.data);
                });
            }
        } // close methods
    }); // closing VUE instance
})(); // closing IIFE
