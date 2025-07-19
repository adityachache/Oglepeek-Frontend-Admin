import { CircularProgress } from "@mui/material";
import { GenericDataGrid } from "./GenericDataGrid";
import { useGetAllProductsQuery } from "../services/api";
import type { GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { DialogBox } from "./DialogBox";
import { UpdateItemForm } from "./UpdateItemForm";

type ProductRow = {
  id: string;
  productName: string;
  frameStyle: string;
  lens: string;
  gender: string;
  material: string;
  description?: string;
  frameType?: string;
  productType: string;
  productId: string;
  variant: Variant[];
};

export type Variant = {
  variantId?: string; // Optional if not used
  inStock: number;
  frameColor: string;
  price: number;
  size: string;
  hidden: boolean;
  images: string[]; // or string[] if URLs
};

type EditableProduct = {
  productData: {
    productId: string;
    name: string;
    frameStyle: string;
    description: string;
    lens: string;
    gender: string;
    material: string;
    productType: string;
    frameType: string;
  };
  variants: Variant[];
};

const columns: GridColDef[] = [
  { field: "productName", headerName: "Product Name", width: 180 },
  { field: "frameStyle", headerName: "Frame Style", width: 150 },
  { field: "frameType", headerName: "Frame Type", width: 150 },
  { field: "description", headerName: "Description", width: 150 },
  { field: "lens", headerName: "Lens", width: 120 },
  { field: "gender", headerName: "Gender", width: 100 },
  { field: "material", headerName: "Material", width: 120 },
  { field: "productType", headerName: "Product Type", width: 150 },
  { field: "productId", headerName: "ID", width: 250 },
];

export const ProductGrid = () => {
  const [openEditForm, setOpenEditForm] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<{
    productData: EditableProduct["productData"];
    variants: EditableProduct["variants"];
  } | null>(null);

  const { data: allProducts, isLoading } = useGetAllProductsQuery();

  console.log(allProducts);

  const productData =
    allProducts?.map((product) => ({
      id: product._id,
      productId: product._id,
      productName: product.name,
      frameStyle: product.frameStyle,
      lens: product.lens,
      gender: product.gender,
      material: product.material,
      description: product.description,
      frameType: product.frameType,
      productType: product.productType,
      variant: product.variants.map((variant) => ({
        variantId: variant._id,
        frameColor: variant.frameColor,
        inStock: variant.inStock,
        price: variant.price,
        size: variant.size,
        hidden: variant.hidden ?? false,
        images: variant.images ?? [],
      })),
    })) ?? [];

  return (
    <div>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <GenericDataGrid<ProductRow>
          rows={productData ?? []}
          columns={columns}
          pageSize={5}
          getRowId={(row) => row.productId} // Ensure the id field is used for row identification
          checkboxSelection={false}
          doubleClickFn={(row) => {
            const editableProduct = {
              productId: row.productId,
              name: row.productName,
              frameStyle: row.frameStyle,
              description: row.description ?? "",
              lens: row.lens,
              gender: row.gender,
              material: row.material,
              productType: row.productType,
              frameType: row.frameType ?? "",
            };

            const variants = row.variant.map((variant) => ({
              variantId: variant.variantId,
              inStock: variant.inStock,
              frameColor: variant.frameColor,
              price: variant.price,
              size: variant.size,
              hidden: variant.hidden ?? false,
              images: variant.images ?? [],
            }));

            setSelectedProduct({ productData: editableProduct, variants });
            setOpenEditForm(true);
          }}
        />
      )}

      {openEditForm && selectedProduct ? (
        <DialogBox
          title="Update Product or Add Variant"
          fieldform={
            <UpdateItemForm
              productData={selectedProduct.productData}
              variants={selectedProduct.variants}
            />
          }
          openform={openEditForm}
          closeform={setOpenEditForm}
        />
      ) : null}
    </div>
  );
};
