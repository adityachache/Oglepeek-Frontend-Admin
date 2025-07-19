import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { DropdownInput } from "./DropdownInput";
import { TextInput } from "./TextInput";
import { Button, Grid, IconButton } from "@mui/material";
import { CheckboxInput } from "./CheckboxInput";
import FileUploadInput from "./FileUploadInput";
import { useCreateVariantMutation } from "../services/api";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

type Props = {
  productId: string;
};

const schema = yup
  .object({
    frameColor: yup.string().required(),
    inStock: yup.number().positive().integer().required(),
    price: yup.number().positive().integer().required(),
    size: yup.string().required(),
    hidden: yup.boolean().default(false),
    images: yup.array().required(),
  })
  .required();

export const AddVariantForm = ({ productId }: Props) => {
  type FormValues = yup.InferType<typeof schema>;

  const [newImages, setNewImages] = useState<File[]>([]);

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      frameColor: "",
      inStock: 0,
      price: 0,
      size: "",
      hidden: false,
      images: [],
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const [createVariant] = useCreateVariantMutation();

  const createProductVariant = (data: FormValues) => {
    createVariant({ body: data, productId: productId })
      .unwrap()
      .then((res) => {
        console.log(res);
        alert(res?.data?.message);
      })
      .catch((err) => {
        console.error(err);
        alert(err?.data?.message);
      });
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(createProductVariant)}>
          <div className="grid grid-cols-3 gap-4 py-4">
            <div>
              <TextInput
                label={"frameColor"}
                defaultValue="frameColor"
                {...register("frameColor")}
                error={!!errors.frameColor}
                helperText={errors.frameColor?.message}
              />
            </div>

            <div>
              <TextInput
                label={"inStock"}
                defaultValue="inStock"
                {...register("inStock")}
                error={!!errors.inStock}
                helperText={errors.inStock?.message}
              />
            </div>

            <div>
              <TextInput
                label={"price"}
                defaultValue="price"
                {...register("price")}
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            </div>

            <div>
              <DropdownInput
                label={"size"}
                name="size"
                error={!!errors.size}
                items={[
                  { value: "Round", label: "Man" },
                  { value: "Square", label: "Woman" },
                  { value: "Oval", label: "Unisex" },
                  { value: "Heart-Shape", label: "Heart-Shape" },
                ]}
                helperText={errors.size?.message}
              />
            </div>

            <div>
              <CheckboxInput name="hidden" label="Hidden" />
            </div>

            <div>
              <FileUploadInput
                onUpload={(files) =>
                  setNewImages((prev) => [...prev, ...files])
                }
                selectedFiles={newImages}
              />
            </div>

            <Grid container spacing={2} mt={2}>
              {newImages.map((file, index) => (
                <Grid key={`new-${index}`}>
                  <div style={{ position: "relative" }}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt="new"
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeNewImage(index)}
                      style={{ position: "absolute", top: 0, right: 0 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </div>
                </Grid>
              ))}
            </Grid>
          </div>
          <div>
            <Button type="submit" variant="contained">
              Add
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
