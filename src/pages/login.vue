<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "vue-sonner";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const isSubmitting = ref(false);
const showPassword = ref(false);
const isLoading = ref(true);

// Check if the user is already authenticated on component mount
onMounted(() => {
  // Short delay to ensure auth store is initialized
  setTimeout(() => {
    if (authStore.isAuthenticated) {
      console.log("User already authenticated, redirecting to appropriate dashboard");
      redirectToDashboard();
    }
    isLoading.value = false;
  }, 300);
});

// Utility function to redirect based on user role
function redirectToDashboard() {
  const userRole = authStore.user?.user_type;
  
  switch (userRole) {
    case "superadmin":
      router.replace("/superadmin/home");
      break;
    case "admin":
      router.replace("/admin/home");
      break;
    case "manager":
      router.replace("/manager/home");
      break;
    case "user":
      router.replace("/user/home");
      break;
    default:
      // Stay on login page if role is unknown
      break;
  }
}

async function handleSubmit() {
  if (!email.value || !password.value) {
    toast.error("Please fill in all fields");
    return;
  }

  try {
    isSubmitting.value = true;

    await authStore.login({
      email: email.value,
      password: password.value,
    });

    // Get the redirect path from query parameters or use role-based default
    const redirectPath = router.currentRoute.value.query.redirect as string;
    if (redirectPath) {
      router.push(redirectPath);
    } else {
      redirectToDashboard();
    }
  } catch (error: any) {
    console.error("Login error:", error);
    toast.error(error.message || "Invalid email or password");
  } finally {
    isSubmitting.value = false;
  }
}

// Quick login functions
async function quickLoginAsSuperadmin() {
  try {
    isSubmitting.value = true;
    await authStore.login({
      email: "superadmin@example.com",
      password: "superadmin123",
    });
    console.log("Superadmin login successful, redirecting to dashboard");
    router.push("/superadmin/home");
  } catch (error: any) {
    console.error("Superadmin login failed:", error);
    toast.error(error.message || "Login failed");
  } finally {
    isSubmitting.value = false;
  }
}

async function quickLoginAsAdmin() {
  try {
    isSubmitting.value = true;
    await authStore.login({
      email: "admin@example.com",
      password: "admin123",
    });
    console.log("Admin login successful, redirecting to dashboard");
    router.push("/admin/home");
  } catch (error: any) {
    console.error("Admin login failed:", error);
    toast.error(error.message || "Login failed");
  } finally {
    isSubmitting.value = false;
  }
}

async function quickLoginAsUser() {
  try {
    isSubmitting.value = true;
    await authStore.login({
      email: "user@example.com",
      password: "user123",
    });
    console.log("User login successful, redirecting to home");
    router.push("/user/home");
  } catch (error: any) {
    console.error("User login failed:", error);
    toast.error(error.message || "Login failed");
  } finally {
    isSubmitting.value = false;
  }
}

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}
</script>

<template>
  <div v-if="isLoading" class="flex items-center justify-center h-full">
    <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
  </div>
  
  <div v-else>
    <div class="flex flex-col space-y-2 text-center">
      <h1 class="text-2xl font-semibold tracking-tight">
        Sign in to your account
      </h1>
      <p class="text-sm text-muted-foreground">
        Enter your email and password below to sign in
      </p>
    </div>

    <Card>
      <CardContent class="pt-4">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label for="password">Password</Label>
              <router-link
                to="/forgot-password"
                class="text-xs text-primary underline underline-offset-4 hover:text-primary/90"
              >
                Forgot password?
              </router-link>
            </div>
            <div class="relative">
              <Input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute inset-y-0 right-0 flex items-center px-3"
              >
                <span class="text-sm text-gray-500">
                  <svg
                    v-if="showPassword"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-4 w-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-4 w-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
                    />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
          <Button
            type="submit"
            class="w-full"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting">
              <svg
                class="animate-spin mr-2 h-4 w-4 text-primary-foreground"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Signing in...
            </span>
            <span v-else>Sign in</span>
          </Button>
        </form>

        <!-- Quick Login Buttons -->
        <div class="mt-6 space-y-3">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <span class="w-full border-t"></span>
            </div>
            <div class="relative flex justify-center text-xs">
              <span class="bg-background px-2 text-muted-foreground">
                Quick Login
              </span>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              @click="quickLoginAsSuperadmin"
              :disabled="isSubmitting"
            >
              Superadmin
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              @click="quickLoginAsAdmin"
              :disabled="isSubmitting"
            >
              Admin
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              @click="quickLoginAsUser"
              :disabled="isSubmitting"
            >
              User
            </Button>
          </div>
          <p class="text-xs text-center text-muted-foreground">
            Superadmin: Platform manager | Admin: Regular admin | User: Standard user
          </p>
        </div>
      </CardContent>
    </Card>

    <p class="text-center text-sm text-muted-foreground mt-6">
      Don't have an account?
      <router-link
        to="/register"
        class="text-primary underline underline-offset-4 hover:text-primary/90"
      >
        Sign up
      </router-link>
    </p>
  </div>
</template>
