"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {  useState } from "react";
import { HexColorPicker } from "react-colorful";
import customFetch from "@/utils/fetchCustomData";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import InputEmoji from 'react-input-emoji'

const nonEmojiRegex = /[A-Za-z0-9!@#$%^&*()_+=[\]{};:'",.<>?/\\|`~]/;

const formSchema = z.object({
   label: z.string().min(4, {
        message: "Debes elegir un nombre",
      }), 
  color: z.string().min(4, {
    message: "Debes elegir un color",
  }),
  emoji:z.string().refine((val) => !nonEmojiRegex.test(val), {
    message: "Solo puedes introducir emojis en este campo",
  }),
  
  

 
  // areas: z.any().default([])
});

interface CrearCarpetaFormProps {
  setmodalOpenCarpetas: (value: boolean) => void;
  addCarpeta:any
}

export function CrearCarpetaForm({
  setmodalOpenCarpetas,
  addCarpeta
}: CrearCarpetaFormProps) {
  
  

  const [isSubmitting, setIsSubmitting] = useState(false);
 
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    
    setIsSubmitting(true) 
    
 
      try {
        console.log(values);
        
        // if(!requiereArchivos) setModalOpen(false);
        
        // setIsNovedadSubida(true);
        const { data, error } = await customFetch<any>({
          endpoint: 'novedades/carpetas',
          method: 'POST',
          body: { 
            label:values.label,
            color:values.color,
            emoji: values.emoji,
            
          
           },
        });
        addCarpeta({...data, novedades: []})
        console.log({...data, novedades: []})
        console.log(error)
        
        setmodalOpenCarpetas(false)
        setIsSubmitting(false);
      } catch (error) {
        console.log(error)
        setIsSubmitting(false);
        alert("No se ha podido agregar la carpeta");
      }
    
  }



 
    
    // if(error || errorAreas || errorAreasGenerales) return "No se ha podido cargar el contenido"
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={`space-y-8 mt-4`}
          id="edit-user-form"
        >

            <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                <Input placeholder="Nombre de la carpeta" {...field} />
                </FormControl>
                <FormDescription>
                  El nombre de la carpeta
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                <HexColorPicker
                    color={field.value}
                    onChange={(color) => form.setValue("color", color)}
                  />
                </FormControl>
                <FormDescription>
                  La categoria de la novedad a crearse<br></br>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

<FormField
        control={form.control}
        name="emoji"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Identificador de carpeta</FormLabel>
            <FormControl>
              <Controller
                name="emoji"
                control={form.control}
                render={({ field }) => (
                  <InputEmoji
                  
                  maxLength={1}
                  shouldReturn={false}
                  language="es"
                  shouldConvertEmojiToImage={false}
                    value={field.value}
                    onChange={(text) => form.setValue("emoji", text)}
                    cleanOnEnter
                   
                    placeholder="Selecciona un emoji"
                  />
                )}
              />
              </FormControl>
            <FormDescription>
              Selecciona un emoji para agregar como identificador a la carpeta o deja este campo vacio, el identificador te ayudará a encontrar la carpeta más facilmente y debería ser diferente por cada carpeta  (No puedes introducir letras o simbolos en este campo)<br></br>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

         

          
<Button disabled={isSubmitting} type="submit" className="w-full">
            {isSubmitting ? <LoadingSpinner size={"24"} /> : "Crear Carpeta"}
          </Button>         
        </form>
      </Form>
      
    </div>
  );
}
