import { Component, NgZone, OnInit, signal } from '@angular/core';
import { ModalDialogParams } from '@nativescript/angular';
import { BlogService } from '~/app/services/blog.service';
import { Blog } from '~/app/models/blog';
import * as imagePickerPlugin from '@nativescript/imagepicker';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
    ImageAsset,
    ImageSource,
    knownFolders,
    path,
} from '@nativescript/core';

@Component({
    selector: 'ns-blog-create',
    templateUrl: './create-blog.component.html',
    styleUrls: ['./create-blog.component.scss'],
})
export class CreateBlogComponent implements OnInit {
    imageAssets = ImageAsset;
    imageSrc: any;
    imageName: string;
    isSingleMode: boolean = true;
    previewSize: number = 300;
    mode = signal('');
    blogFormGroup = new FormGroup({
        title: new FormControl<string | null>('', Validators.required),
        content: new FormControl<string | null>('', Validators.required),
        photo: new FormControl<string | null>('', Validators.required),
        id: new FormControl<string | null>(''),
    });

    constructor(
        private blogService: BlogService,
        private modalDialogParams: ModalDialogParams,
        private _ngZone: NgZone
    ) {
        const context = modalDialogParams.context;
        this.mode.set(context.mode);
        if (this.mode() === 'edit') {
            const blog: Blog = context.blog;
            this.blogFormGroup.get('title').setValue(blog.title);
            this.blogFormGroup.get('content').setValue(blog.content);
            this.blogFormGroup.get('id').setValue(blog.id);
        }
    }

    ngOnInit(): void {}

    submitCreate() {
        this.blogService
            .createBlog(this.generateBlog())
            .then((blogId) => {
                console.log('Visszakapott ID:', blogId);
                if (blogId) {
                    this.imageSrc &&
                        this.saveImageSource(this.imageSrc, blogId);
                    this.blogService.setBlogs();
                }
                this.modalDialogParams.closeCallback(null);
            })
            .catch((err) => console.error('Valami hiba történt:', err));
    }

    generateBlog(): Blog {
        const blog: Blog = {
            title: this.blogFormGroup.get('title').value,
            content: this.blogFormGroup.get('content').value,
            id: this.blogFormGroup.get('id').value ?? '',
        };
        return blog;
    }

    submitEdit() {
        this.blogService.updateBlog(this.generateBlog());
        this.blogService.setBlogs();
        this.modalDialogParams.closeCallback(null);
    }

    onCancel() {
        this.modalDialogParams.closeCallback(null);
    }

    selectPhoto() {
        this.isSingleMode = true;

        let imagePicker = imagePickerPlugin.create({
            mode: 'single',
        });
        this.startSelection(imagePicker);
    }

    private startSelection(imagePicker) {
        imagePicker
            .authorize()
            .then(() => imagePicker.present())
            .then((selection) => {
                this._ngZone.run(() => {
                    if (selection.length > 0) {
                        const picked = selection[0];
                        this.imageName = picked.filename;

                        ImageSource.fromAsset(picked.asset).then(
                            (imageSource) => {
                                if (imageSource) {
                                    this.imageSrc = imageSource;
                                } else {
                                    console.log(
                                        'Nem sikerült ImageSource-t létrehozni'
                                    );
                                }
                            }
                        );
                    }
                });
            })
            .catch((e) => console.log(e));
    }

    private async saveImageSource(imageSource: ImageSource, blogId: string) {
        const photoToBase64 = imageSource.toBase64String('jpeg', 80);
        await this.blogService
            .uploadPhoto(photoToBase64, blogId)
            .then(() => console.log('Sikeres mentés a felhőbe.'))
            .catch((err) => console.log('Hiba történt ' + err));
    }
}
