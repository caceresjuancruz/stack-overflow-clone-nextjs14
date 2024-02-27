"use client";

import { useTheme } from "@/context/ThemeProvider";
import { AnswerFormSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Editor } from "@tinymce/tinymce-react";
import { createAnswer } from "@/database/actions/answer.action";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { toast } from "../ui/use-toast";
import { images } from "@/constants/images";

interface AnswerFormProps {
  question: string;
  authorId: string;
  questionId: string;
}

const AnswerForm = ({ question, authorId, questionId }: AnswerFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAIAnswer, setIsGeneratingAIAnswer] = useState(false);
  const { mode } = useTheme();
  const editorRef = useRef(null);
  const pathname = usePathname();
  const { userId } = useAuth();

  const form = useForm<z.infer<typeof AnswerFormSchema>>({
    resolver: zodResolver(AnswerFormSchema),
    defaultValues: {
      answer: "",
    },
  });

  async function handleCreateAnswer(values: z.infer<typeof AnswerFormSchema>) {
    if (!userId) {
      return toast({
        title: "Please log in",
        description: "You must be logged in to perform this action",
      });
    }

    setIsSubmitting(true);

    try {
      await createAnswer({
        question: JSON.parse(questionId),
        content: values.answer,
        author: JSON.parse(authorId),
        path: pathname,
      });

      form.reset();

      if (editorRef.current) {
        // @ts-ignore
        editorRef.current.setContent("");
      }
    } catch (error) {
      return toast({
        title: "Something went wrong",
        description: "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const generateAIAnswer = async () => {
    if (!userId) {
      return toast({
        title: "Please log in",
        description: "You must be logged in to perform this action",
      });
    }

    if (!authorId || !questionId) return;

    setIsGeneratingAIAnswer(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`,
        {
          method: "POST",
          body: JSON.stringify({
            question,
          }),
        }
      );

      const aiAnswer = await response.json();

      const formattedAnswer = aiAnswer.reply.replace(/\n/g, "<br />");

      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent(formattedAnswer);
      }

      return toast({
        title: `AI answer generated successfully`,
      });
    } catch (error) {
      return toast({
        title: "Something went wrong",
        description: "Please try again later",
      });
    } finally {
      setIsGeneratingAIAnswer(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>

        <Button
          title="Generate AI Answer"
          aria-label="Generate AI Answer"
          className="btn light-border-2 min-w-[12rem] gap-1.5 rounded-md border px-4 py-2.5 shadow-none md:w-48"
          onClick={generateAIAnswer}
        >
          {isGeneratingAIAnswer ? (
            <span className="primary-text-gradient">Generating...</span>
          ) : (
            <>
              <Image
                src={images.stars}
                alt="Star"
                width={12}
                height={12}
                className="object-contain"
                unoptimized
              />
              <span className="primary-text-gradient">Generate AI Answer</span>
            </>
          )}
        </Button>
      </div>

      <Form {...form}>
        <form
          className="text-dark300_light900 mt-6 flex w-full flex-col gap-10 "
          onSubmit={form.handleSubmit(handleCreateAnswer)}
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    onInit={(evt, editor) => {
                      // @ts-ignore
                      editorRef.current = editor;
                    }}
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "codesample",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                      ],
                      toolbar:
                        "undo redo | " +
                        "codesample | bold italic forecolor | alignleft aligncenter |" +
                        "alignright alignjustify | bullist numlist",
                      content_style:
                        "body { font-family:Inter; font-size:16px }",
                      skin: mode === "dark" ? "oxide-dark" : "oxide",
                      content_css: mode === "dark" ? "dark" : "light",
                    }}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              title="Submit answer"
              className="primary-gradient w-fit text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AnswerForm;
